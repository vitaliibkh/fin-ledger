export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

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

export interface CounterpartyView {
  id: number;
  name: string;
  taxCode: string | null;
  contactInfo: string | null;
  isActive: boolean;
}

export interface CategoryView {
  id: number;
  name: string;
  parentId: number | null;
  parentName?: string;
  isActive: boolean;
}
