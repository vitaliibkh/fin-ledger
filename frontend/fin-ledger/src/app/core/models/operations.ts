export interface JournalEntryView {
  id: number;
  date: string;
  amount: number;
  debitAccountCode: string;
  creditAccountCode: string;
  categoryName: string;
  counterpartyName?: string;
  status: string;
  comment?: string;
}
