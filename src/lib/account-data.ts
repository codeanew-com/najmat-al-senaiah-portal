export interface AccountData {
  accountName: string;
  bank: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  accountType: string;
}

/**
 * Static placeholder data for the demo reveal UI.
 * Swap with a real fetch once a backend/QR payload source exists.
 */
export const demoAccount: AccountData = {
  accountName: "NAJMAT AL SENAIAH SUPERMARKET",
  bank: "ADIB",
  accountNumber: "19662556",
  iban: "AE1605000000000019662556",
  swiftCode: "ABDIAEADXXX",
  accountType: "Corporate Account",
};
