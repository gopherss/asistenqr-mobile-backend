import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async findAll(empresaId: string) {
    return this.prisma.turno.findMany({
      where: { empresaId },
      orderBy: { nombre: 'asc' },
    });
  }

  async update(id: string, dto: UpdateShiftDto, empresaId: string) {
    const turno = await this.prisma.turno.findFirst({
      where: { id, empresaId },
    });

    if (!turno) {
      throw new NotFoundException('Turno no encontrado');
    }

    return this.prisma.turno.update({
      where: { id },
      data: dto,
    });
  }
}