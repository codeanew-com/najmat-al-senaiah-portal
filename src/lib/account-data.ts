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

export const defaultAccount: AccountData = {
  bankNameOfficialEn: "Abu Dhabi Islamic Bank",
  bankNameOfficialAr: "بنك أبوظبي الإسلامي",
  accountTypeEn: "Corporate Account",
  accountTypeAr: "حساب تجاري",
  accountName: "NAJMAT AL SENAIAH SUPERMARKET",
  iban: "AE1605000000000019662556",
  accountNumber: "19662556",
  swiftCode: "ABDIAEADXXX",
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
