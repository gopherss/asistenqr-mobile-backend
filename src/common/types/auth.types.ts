import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  nombres: string;
  rol: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
