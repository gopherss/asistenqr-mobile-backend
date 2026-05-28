import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEmpresaDto) {
    const { adminNombre, adminApellido, adminEmail, adminPassword, ...empresaData } = dto;
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      const empresa = await tx.empresa.create({ data: empresaData });

      await tx.perfil.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          nombre: adminNombre,
          apellido: adminApellido,
          rol: Role.ADMIN,
          empresaId: empresa.id,
        },
      });

      return empresa;
    });
  }

  async findAll() {
    const empresas = await this.prisma.empresa.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: { select: { perfiles: true } },
        perfiles: {
          where: { rol: Role.ADMIN },
          select: { id: true, nombre: true, apellido: true, email: true },
        },
      },
    });

    return empresas.map(({ perfiles, ...empresa }) => ({
      ...empresa,
      admin: perfiles[0] || null,
    }));
  }

  async findOne(id: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      include: { perfiles: true, turnos: true },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return empresa;
  }

  async update(id: string, dto: UpdateEmpresaDto) {
    const { adminNombre, adminApellido, adminEmail, ...empresaData } = dto;
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.empresa.update({
        where: { id },
        data: empresaData,
      });

      if (adminNombre || adminApellido || adminEmail) {
        const adminProfile = await tx.perfil.findFirst({
          where: { empresaId: id, rol: Role.ADMIN },
        });

        if (adminProfile) {
          await tx.perfil.update({
            where: { id: adminProfile.id },
            data: {
              ...(adminNombre && { nombre: adminNombre }),
              ...(adminApellido && { apellido: adminApellido }),
              ...(adminEmail && { email: adminEmail }),
            },
          });
        }
      }

      return updated;
    });
  }

  async toggleStatus(id: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id } });
    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return this.prisma.empresa.update({
      where: { id },
      data: { activo: !empresa.activo },
    });
  }
}