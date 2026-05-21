import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalDocentes = await this.prisma.profile.count({
      where: { rol: 'DOCENTE' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const asistenciasHoy = await this.prisma.asistencia.findMany({
      where: { fecha: today },
      include: {
        docente: {
          select: { nombres: true },
        },
      },
      orderBy: { hora: 'asc' },
    });

    const totalHoy = asistenciasHoy.length;
    const tardanzas = asistenciasHoy.filter(
      (a) => a.estado === 'TARDE',
    ).length;
    const faltan = totalDocentes - totalHoy;

    const presentes = asistenciasHoy.map((a) => ({
      nombres: a.docente.nombres,
      hora: a.hora,
      estado: a.estado.toLowerCase(),
    }));

    return {
      stats: {
        docentes: totalDocentes,
        hoy: totalHoy,
        tarde: tardanzas,
        faltan: Math.max(0, faltan),
      },
      presentes,
    };
  }
}
