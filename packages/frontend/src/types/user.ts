export enum UserRole {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR'
}

export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  nombre: string;
  rol?: UserRole;
}
