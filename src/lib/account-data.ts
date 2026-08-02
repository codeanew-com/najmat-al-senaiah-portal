export interface AccountData {
  bankNameOfficialEn: string;
  bankNameOfficialAr: string;
  accountTypeEn: string;
  accountTypeAr: string;
  accountName: string;
  iban: string;
  accountNumber: string;
  swiftCode: string;
}

/**
 * Placeholder only — deliberately not real data, since this file is bundled
 * for the client (via ACCOUNT_FIELDS/AccountData below) and this repo is public.
 * Real values are seeded from env vars server-side; see account-repo.ts.
 */
export const defaultAccount: AccountData = {
  bankNameOfficialEn: "Your Bank Name",
  bankNameOfficialAr: "اسم البنك",
  accountTypeEn: "Account Type",
  accountTypeAr: "نوع الحساب",
  accountName: "Your Account Name",
  iban: "AE00 0000 0000 0000 0000 000",
  accountNumber: "000000000",
  swiftCode: "XXXXXXXX",
};

export type AccountField =
  | { type: "text"; key: keyof AccountData; label: string }
  | { type: "bilingual"; enKey: keyof AccountData; arKey: keyof AccountData; label: string };

/** Same order as the public homepage displays these fields. */
export const ACCOUNT_FIELDS: AccountField[] = [
  { type: "bilingual", enKey: "bankNameOfficialEn", arKey: "bankNameOfficialAr", label: "Bank (official name)" },
  { type: "bilingual", enKey: "accountTypeEn", arKey: "accountTypeAr", label: "Account type" },
  { type: "text", key: "accountName", label: "Account name" },
  { type: "text", key: "iban", label: "IBAN" },
  { type: "text", key: "accountNumber", label: "Account number" },
  { type: "text", key: "swiftCode", label: "SWIFT code" },
];
