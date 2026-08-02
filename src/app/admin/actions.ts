"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  requestOtp,
  verifyOtp,
  setPendingEmailCookie,
  getPendingEmail,
  clearPendingEmailCookie,
  createSession,
  destroySession,
  getAdminSession,
} from "@/lib/admin/auth";
import { sendOtpEmail } from "@/lib/admin/mailer";
import { saveAccountData } from "@/lib/account-repo";
import { ACCOUNT_FIELDS, type AccountData } from "@/lib/account-data";

export interface RequestOtpState {
  status: "idle" | "sent" | "error";
  message?: string;
}

export async function requestOtpAction(
  _prev: RequestOtpState,
  formData: FormData
): Promise<RequestOtpState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { status: "error", message: "Enter an email address." };

  const result = await requestOtp(email);
  await setPendingEmailCookie(email);
  if (result) {
    // Not awaited: sending mail is a full SMTP round-trip, and awaiting it here
    // would make matched vs. unmatched emails distinguishable by response time,
    // defeating the point of always returning the same generic message below.
    sendOtpEmail(email, result.code).catch(() => {});
  }

  return { status: "sent", message: "If that email is registered, a code has been sent." };
}

export interface VerifyOtpState {
  status: "idle" | "error";
  message?: string;
}

export async function verifyOtpAction(
  _prev: VerifyOtpState,
  formData: FormData
): Promise<VerifyOtpState> {
  const code = String(formData.get("code") ?? "").trim();
  const email = await getPendingEmail();

  if (!email) {
    return { status: "error", message: "This code has expired. Request a new one." };
  }

  const ok = await verifyOtp(email, code);
  if (!ok) {
    return { status: "error", message: "Invalid or expired code." };
  }

  await clearPendingEmailCookie();
  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin");
}

export interface UpdateAccountState {
  status: "idle" | "saved" | "error";
  message?: string;
}

export async function updateAccountAction(
  _prev: UpdateAccountState,
  formData: FormData
): Promise<UpdateAccountState> {
  const authed = await getAdminSession();
  if (!authed) {
    return { status: "error", message: "Session expired. Please log in again." };
  }

  const data = {} as AccountData;
  for (const field of ACCOUNT_FIELDS) {
    if (field.type === "text") {
      const value = String(formData.get(field.key) ?? "").trim();
      if (!value) {
        return { status: "error", message: `${field.label} is required.` };
      }
      data[field.key] = value;
    } else {
      const en = String(formData.get(field.enKey) ?? "").trim();
      const ar = String(formData.get(field.arKey) ?? "").trim();
      if (!en || !ar) {
        return { status: "error", message: `${field.label} (English and Arabic) is required.` };
      }
      data[field.enKey] = en;
      data[field.arKey] = ar;
    }
  }

  saveAccountData(data);
  revalidatePath("/", "layout");

  return { status: "saved", message: "Saved." };
}
