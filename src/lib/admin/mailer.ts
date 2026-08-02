import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST,
      port: Number(process.env.EMAIL_SMTP_PORT),
      secure: process.env.EMAIL_SMTP_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${code} is your admin login code`,
    text: `Your admin login code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family: -apple-system, sans-serif; color: #1d1d1f;">
        <p>Your admin login code is:</p>
        <p style="font-size: 32px; font-weight: 600; letter-spacing: 4px;">${code}</p>
        <p style="color: #7a7a7a; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}
