import { Request } from 'express';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: Role;
  empresaId: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
