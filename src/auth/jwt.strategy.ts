import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.perfil.findUnique({
      where: { id: payload.sub },
      include: { empresa: true },
    });

    if (!user || !user.estado) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    if (user.empresa && !user.empresa.activo) {
      throw new UnauthorizedException('Empresa inactiva');
    }

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      rol: user.rol,
      empresaId: user.empresaId,
    };
  }
}
