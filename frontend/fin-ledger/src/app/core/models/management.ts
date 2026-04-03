export type AccountType = 'Active' | 'Passive' | 'Active-Passive';

export interface Currency {
  id: number;
  code: string;
  name: string;
}

export interface AccountView {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  currencyId: number;
  parentId: number | null;
  balance: number;
  isActive: boolean;
}

export interface AccountFormDTO {
  code: string;
  name: string;
  type: AccountType;
  currencyId: number;
  parentId: number | null;
  isActive: boolean;
}
