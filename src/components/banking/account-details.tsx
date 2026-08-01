import { getTranslations } from "next-intl/server";
import type { AccountData } from "@/lib/account-data";
import { CopyButton } from "@/components/ui/copy-button";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hairline py-4 last:border-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[14px] leading-[1.43] tracking-[-0.224px] text-ink-muted-48">
          {label}
        </span>
        <span className="break-words font-mono text-[19px] leading-[1.3] tracking-wide text-ink">
          {value}
        </span>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

export async function AccountDetails({ account }: { account: AccountData }) {
  const t = await getTranslations("account");

  return (
    <div className="w-full max-w-md rounded-lg border border-hairline bg-canvas px-6">
      <Field label={t("accountName")} value={account.accountName} />
      <Field label={t("bank")} value={account.bank} />
      <Field label={t("iban")} value={account.iban} />
      <Field label={t("accountNumber")} value={account.accountNumber} />
      <Field label={t("swiftCode")} value={account.swiftCode} />
      <Field label={t("accountType")} value={account.accountType} />
    </div>
  );
}
