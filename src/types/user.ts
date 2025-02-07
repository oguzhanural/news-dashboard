export type UserRole = 'ADMIN' | 'EDITOR' | 'JOURNALIST';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
}
