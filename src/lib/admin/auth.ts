import { randomBytes, randomInt, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { db, cleanupExpired } from "@/lib/db";

const SESSION_COOKIE = "admin_session";
const PENDING_EMAIL_COOKIE = "admin_pending_email";

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_REQUEST_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_REQUESTS_PER_HOUR = 5;
const OTP_MAX_ATTEMPTS = 5;
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function pepper() {
  return process.env.SESSION_SECRET ?? "";
}

function hashCode(code: string, salt: string) {
  return scryptSync(`${code}:${pepper()}`, salt, 64).toString("hex");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isAdminEmail(email: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && normalizeEmail(email) === normalizeEmail(adminEmail);
}

interface OtpRow {
  id: number;
  code_hash: string;
  code_salt: string;
  expires_at: number;
  attempts: number;
}

/**
 * Always returns a generic outcome regardless of whether the email matched,
 * so this endpoint can't be used to enumerate the admin address. Mail is only
 * actually sent on a real match.
 */
export async function requestOtp(rawEmail: string): Promise<{ code: string } | null> {
  cleanupExpired();
  const email = normalizeEmail(rawEmail);
  if (!isAdminEmail(email)) return null;

  const now = Date.now();
  const recent = db
    .prepare("SELECT created_at FROM otp_codes WHERE email = ? ORDER BY created_at DESC LIMIT 1")
    .get(email) as { created_at: number } | undefined;
  if (recent && now - recent.created_at < OTP_REQUEST_COOLDOWN_MS) return null;

  const hourAgo = now - 60 * 60 * 1000;
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM otp_codes WHERE email = ? AND created_at > ?")
    .get(email, hourAgo) as { count: number };
  if (count >= OTP_MAX_REQUESTS_PER_HOUR) return null;

  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  const salt = randomBytes(16).toString("hex");
  const codeHash = hashCode(code, salt);

  db.prepare(
    `INSERT INTO otp_codes (email, code_hash, code_salt, expires_at, attempts, created_at)
     VALUES (?, ?, ?, ?, 0, ?)`
  ).run(email, codeHash, salt, now + OTP_TTL_MS, now);

  return { code };
}

export async function setPendingEmailCookie(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(PENDING_EMAIL_COOKIE, normalizeEmail(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: OTP_TTL_MS / 1000,
  });
}

export async function getPendingEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PENDING_EMAIL_COOKIE)?.value ?? null;
}

export async function clearPendingEmailCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_EMAIL_COOKIE);
}

export async function verifyOtp(rawEmail: string, submittedCode: string): Promise<boolean> {
  cleanupExpired();
  const email = normalizeEmail(rawEmail);
  if (!isAdminEmail(email)) return false;

  const now = Date.now();
  const row = db
    .prepare(
      `SELECT id, code_hash, code_salt, expires_at, attempts FROM otp_codes
       WHERE email = ? AND consumed_at IS NULL AND expires_at > ?
       ORDER BY created_at DESC LIMIT 1`
    )
    .get(email, now) as OtpRow | undefined;

  if (!row || row.attempts >= OTP_MAX_ATTEMPTS) return false;

  const submittedHash = Buffer.from(hashCode(submittedCode, row.code_salt), "hex");
  const storedHash = Buffer.from(row.code_hash, "hex");
  const match = submittedHash.length === storedHash.length && timingSafeEqual(submittedHash, storedHash);

  if (!match) {
    db.prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?").run(row.id);
    return false;
  }

  db.prepare("UPDATE otp_codes SET consumed_at = ? WHERE id = ?").run(now, row.id);
  return true;
}

export async function createSession(): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  db.prepare("INSERT INTO sessions (id, expires_at, created_at) VALUES (?, ?, ?)").run(
    hashToken(token),
    now + SESSION_TTL_MS,
    now
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function getAdminSession(): Promise<boolean> {
  cleanupExpired();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const row = db
    .prepare("SELECT expires_at FROM sessions WHERE id = ?")
    .get(hashToken(token)) as { expires_at: number } | undefined;

  return !!row && row.expires_at > Date.now();
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(hashToken(token));
  }
  cookieStore.delete(SESSION_COOKIE);
}
