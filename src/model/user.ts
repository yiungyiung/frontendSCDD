import { Role } from './role';

export interface User {
  userId?: number;
  email: string;
  role?: Role;
  name:string;
  contact_Number:string;
  isActive?: boolean;
  roleId?: number;
}