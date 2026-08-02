"use client";

import { useActionState } from "react";
import { ACCOUNT_FIELDS, type AccountData } from "@/lib/account-data";
import { updateAccountAction, logoutAction, type UpdateAccountState } from "@/app/admin/actions";

const inputClass =
  "w-full rounded-sm border border-hairline bg-canvas px-4 py-2.5 text-[15px] text-ink outline-none transition focus:border-primary";

const initialState: UpdateAccountState = { status: "idle" };

export function AccountForm({ account }: { account: AccountData }) {
  const [state, formAction, pending] = useActionState(updateAccountAction, initialState);

  return (
    <div className="w-full max-w-120 rounded-lg border border-hairline bg-canvas p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-semibold text-ink">Account details</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-[13px] text-ink-muted-48 hover:text-ink">
            Log out
          </button>
        </form>
      </div>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        {ACCOUNT_FIELDS.map((field) =>
          field.type === "text" ? (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={field.key} className="text-[13px] text-ink-muted-48">
                {field.label}
              </label>
              <input
                id={field.key}
                name={field.key}
                defaultValue={account[field.key]}
                required
                className={inputClass}
              />
            </div>
          ) : (
            <div key={field.enKey} className="flex flex-col gap-1.5">
              <span className="text-[13px] text-ink-muted-48">{field.label}</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id={field.enKey}
                  name={field.enKey}
                  defaultValue={account[field.enKey]}
                  placeholder="English"
                  required
                  className={inputClass}
                />
                <input
                  id={field.arKey}
                  name={field.arKey}
                  defaultValue={account[field.arKey]}
                  placeholder="العربية"
                  dir="rtl"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          )
        )}

        {state.status === "error" && <p className="text-[13px] text-red-600">{state.message}</p>}
        {state.status === "saved" && <p className="text-[13px] text-primary">Saved.</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-fit rounded-pill bg-primary px-6 py-2.5 text-[15px] font-medium text-white transition active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
