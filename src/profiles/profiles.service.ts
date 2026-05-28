import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAll(empresaId: string) {
    return this.prisma.perfil.findMany({
      where: { rol: Role.EMPLEADO, empresaId },
      include: { turno: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, empresaId: string) {
    const profile = await this.prisma.perfil.findFirst({
      where: { id, empresaId },
      include: { turno: true },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return profile;
  }

  async update(id: string, dto: UpdateProfileDto, empresaId: string) {
    const profile = await this.prisma.perfil.findFirst({
      where: { id, empresaId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return this.prisma.perfil.update({
      where: { id },
      data: dto,
      include: { turno: true },
    });
  }

  async toggleStatus(id: string, empresaId: string) {
    const profile = await this.prisma.perfil.findFirst({
      where: { id, empresaId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return this.prisma.perfil.update({
      where: { id },
      data: { estado: !profile.estado },
      include: { turno: true },
    });
  }
}