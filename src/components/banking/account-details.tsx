import { getTranslations } from "next-intl/server";
import type { AccountData } from "@/lib/account-data";
import { Field } from "@/components/banking/field";

export async function AccountDetails({ account }: { account: AccountData }) {
  const t = await getTranslations("account");

  return (
    <div className="w-full max-w-[30rem] rounded-lg border border-hairline bg-canvas px-6">
      <Field label={t("accountType")} value={account.accountType} />
      <Field label={t("accountName")} value={account.accountName} />
      <Field
        label={t("bank")}
        value={`${account.bank} (${t("bankNameValue")})`}
        copyValue={account.bankNameOfficial}
      />
      <Field label={t("iban")} value={account.iban} />
      <Field label={t("accountNumber")} value={account.accountNumber} />
      <Field label={t("swiftCode")} value={account.swiftCode} />
    </div>
  );
}
