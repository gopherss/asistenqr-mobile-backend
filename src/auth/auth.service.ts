import {
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
    const profile = await this.prisma.profile.findUnique({
      where: { email: dto.email },
    });

    if (!profile) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!profile.estado) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordValid = await bcrypt.compare(dto.password, profile.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateAuthResponse(profile);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.profile.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const profile = await this.prisma.profile.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        nombres: dto.nombres,
        rol: Role.DOCENTE,
        dni: dto.dni,
        telefono: dto.telefono,
        turnoId: dto.turnoId,
        estado: true,
      },
    });

    return this.generateAuthResponse(profile);
  }

  async me(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: { turno: true },
    });

    if (!profile) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password, ...user } = profile;
    return user;
  }

  private generateAuthResponse(profile: { id: string; email: string; nombres: string; rol: string }) {
    const payload = {
      sub: profile.id,
      email: profile.email,
      rol: profile.rol,
    };

    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: profile.id,
        email: profile.email,
        nombres: profile.nombres,
        rol: profile.rol,
      },
    };
  }
}
