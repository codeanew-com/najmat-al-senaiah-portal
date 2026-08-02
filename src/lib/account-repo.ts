import { db } from "@/lib/db";
import { defaultAccount, type AccountData } from "@/lib/account-data";

interface AccountRow {
  bank_name_official_en: string;
  bank_name_official_ar: string;
  account_type_en: string;
  account_type_ar: string;
  account_name: string;
  iban: string;
  account_number: string;
  swift_code: string;
}

function rowToAccountData(row: AccountRow): AccountData {
  return {
    bankNameOfficialEn: row.bank_name_official_en,
    bankNameOfficialAr: row.bank_name_official_ar,
    accountTypeEn: row.account_type_en,
    accountTypeAr: row.account_type_ar,
    accountName: row.account_name,
    iban: row.iban,
    accountNumber: row.account_number,
    swiftCode: row.swift_code,
  };
}

export function getAccountData(): AccountData {
  const row = db.prepare("SELECT * FROM account WHERE id = 1").get() as AccountRow | undefined;
  if (row) return rowToAccountData(row);

  saveAccountData(defaultAccount);
  return defaultAccount;
}

export function saveAccountData(data: AccountData): void {
  db.prepare(
    `INSERT INTO account (id, bank_name_official_en, bank_name_official_ar, account_type_en, account_type_ar, account_name, iban, account_number, swift_code, updated_at)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (id) DO UPDATE SET
       bank_name_official_en = excluded.bank_name_official_en,
       bank_name_official_ar = excluded.bank_name_official_ar,
       account_type_en = excluded.account_type_en,
       account_type_ar = excluded.account_type_ar,
       account_name = excluded.account_name,
       iban = excluded.iban,
       account_number = excluded.account_number,
       swift_code = excluded.swift_code,
       updated_at = excluded.updated_at`
  ).run(
    data.bankNameOfficialEn,
    data.bankNameOfficialAr,
    data.accountTypeEn,
    data.accountTypeAr,
    data.accountName,
    data.iban,
    data.accountNumber,
    data.swiftCode,
    Date.now()
  );
}
