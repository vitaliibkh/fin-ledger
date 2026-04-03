export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DictionaryItem {
  id: number;
  code?: string;
  name: string;
}
