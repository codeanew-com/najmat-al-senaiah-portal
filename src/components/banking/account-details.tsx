import { getTranslations } from "next-intl/server";
import type { AccountData } from "@/lib/account-data";
import { Field } from "@/components/banking/field";
import { ShareButton } from "@/components/banking/share-button";

export async function AccountDetails({
  account,
  locale,
}: {
  account: AccountData;
  locale: string;
}) {
  const t = await getTranslations("account");
  const isArabic = locale === "ar";
  const bankNameOfficial = isArabic ? account.bankNameOfficialAr : account.bankNameOfficialEn;
  const accountType = isArabic ? account.accountTypeAr : account.accountTypeEn;

  const shareText = [
    `${t("bank")}: ${bankNameOfficial}`,
    `${t("accountType")}: ${accountType}`,
    `${t("accountName")}: ${account.accountName}`,
    `${t("iban")}: ${account.iban}`,
    `${t("accountNumber")}: ${account.accountNumber}`,
    `${t("swiftCode")}: ${account.swiftCode}`,
  ].join("\n");

  return (
    <div className="w-full max-w-120 rounded-lg border border-hairline bg-canvas px-6">
      <Field label={t("bank")} value={bankNameOfficial} copyDisabled={true} />
      <Field label={t("accountType")} value={accountType} copyDisabled={true} />
      <Field label={t("accountName")} value={account.accountName} />
      <Field label={t("iban")} value={account.iban} />
      <Field label={t("accountNumber")} value={account.accountNumber} />
      <Field label={t("swiftCode")} value={account.swiftCode} />

      <div className="border-t border-hairline py-4">
        <ShareButton text={shareText} />
      </div>
    </div>
  );
}
