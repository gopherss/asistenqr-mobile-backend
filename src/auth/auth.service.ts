import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const profile = await this.prisma.perfil.findUnique({
      where: { email: dto.email },
      include: { empresa: true },
    });

    if (!profile) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!profile.estado) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (profile.empresa && !profile.empresa.activo) {
      throw new UnauthorizedException('Empresa inactiva');
    }

    const passwordValid = await bcrypt.compare(dto.password, profile.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateAuthResponse(profile);
  }

  async register(dto: RegisterDto, adminEmpresaId: string) {
    const existing = await this.prisma.perfil.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id: adminEmpresaId },
    });

    if (!empresa) {
      throw new BadRequestException('Empresa no encontrada');
    }

    const empleadosCount = await this.prisma.perfil.count({
      where: { empresaId: adminEmpresaId, rol: Role.EMPLEADO },
    });

    if (empleadosCount >= empresa.maxEmpleados) {
      throw new BadRequestException(
        `Límite de ${empresa.maxEmpleados} empleados alcanzado`,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const profile = await this.prisma.perfil.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        nombre: dto.nombre,
        apellido: dto.apellido,
        rol: Role.EMPLEADO,
        turnoId: dto.turnoId,
        empresaId: adminEmpresaId,
        estado: true,
      },
    });

    return this.generateAuthResponse(profile);
  }

  async me(userId: string) {
    const profile = await this.prisma.perfil.findUnique({
      where: { id: userId },
      include: { turno: true, empresa: true },
    });

    if (!profile) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!profile.estado) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    if (profile.empresa && !profile.empresa.activo) {
      throw new UnauthorizedException('Empresa inactiva');
    }

    const { password, ...user } = profile;
    return user;
  }

  private generateAuthResponse(profile: { id: string; email: string; nombre: string; apellido: string; rol: string; empresaId: string | null }) {
    const payload = {
      sub: profile.id,
      email: profile.email,
      rol: profile.rol,
      empresaId: profile.empresaId,
    };

    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: profile.id,
        email: profile.email,
        nombre: profile.nombre,
        apellido: profile.apellido,
        rol: profile.rol,
        empresaId: profile.empresaId,
      },
    };
  }
}