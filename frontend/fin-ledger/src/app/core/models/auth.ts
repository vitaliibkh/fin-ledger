export type UserRole = 'Operator' | 'Financial Manager' | 'Analyst';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  email?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
