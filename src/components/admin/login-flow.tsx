"use client";

import { useActionState, useEffect, useState } from "react";
import {
  requestOtpAction,
  verifyOtpAction,
  type RequestOtpState,
  type VerifyOtpState,
} from "@/app/admin/actions";

const inputClass =
  "w-full rounded-sm border border-hairline bg-canvas px-4 py-2.5 text-[15px] text-ink outline-none transition focus:border-primary";

const buttonClass =
  "w-full rounded-pill bg-primary px-6 py-2.5 text-[15px] font-medium text-white transition active:scale-[0.98] disabled:opacity-50";

const initialRequestState: RequestOtpState = { status: "idle" };
const initialVerifyState: VerifyOtpState = { status: "idle" };

export function LoginFlow() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [requestState, requestAction, requestPending] = useActionState(
    requestOtpAction,
    initialRequestState
  );
  const [verifyState, verifyAction, verifyPending] = useActionState(
    verifyOtpAction,
    initialVerifyState
  );

  useEffect(() => {
    if (requestState.status === "sent") setStep("otp");
  }, [requestState]);

  return (
    <div className="w-full max-w-sm rounded-lg border border-hairline bg-canvas p-8">
      <h1 className="text-[20px] font-semibold text-ink">Admin login</h1>

      {step === "email" ? (
        <form action={requestAction} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] text-ink-muted-48">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          {requestState.status === "error" && (
            <p className="text-[13px] text-red-600">{requestState.message}</p>
          )}
          <button type="submit" disabled={requestPending} className={buttonClass}>
            {requestPending ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form action={verifyAction} className="mt-6 flex flex-col gap-4">
          <p className="text-[13px] text-ink-muted-48">
            Enter the 6-digit code sent to {email}.
          </p>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" className="text-[13px] text-ink-muted-48">
              Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              autoFocus
              className={`${inputClass} text-center text-[20px] tracking-[6px] tabular-nums`}
              placeholder="000000"
            />
          </div>
          {verifyState.status === "error" && (
            <p className="text-[13px] text-red-600">{verifyState.message}</p>
          )}
          <button type="submit" disabled={verifyPending} className={buttonClass}>
            {verifyPending ? "Verifying…" : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-[13px] text-primary"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
