import { Role } from './role';

export interface User {
  email: string;
  role: Role;
  name:string;
  contact_Number:string;
  isActive: boolean;
}