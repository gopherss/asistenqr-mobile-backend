import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(empresaId: string) {
    const totalEmpleados = await this.prisma.perfil.count({
      where: { rol: 'EMPLEADO', empresaId },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const asistenciasHoy = await this.prisma.asistencia.findMany({
      where: { fecha: today, empresaId },
      include: {
        empleado: {
          select: { nombre: true, apellido: true },
        },
      },
      orderBy: { hora: 'asc' },
    });

    const totalHoy = asistenciasHoy.length;
    const tardanzas = asistenciasHoy.filter(
      (a) => a.estado === 'TARDE',
    ).length;
    const faltan = totalEmpleados - totalHoy;

    const empleados = await this.prisma.perfil.findMany({
      where: { rol: 'EMPLEADO', estado: true, empresaId },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        turno: { select: { nombre: true } },
      },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    });

    const presentes = asistenciasHoy.map((a) => ({
      nombres: `${a.empleado.nombre} ${a.empleado.apellido}`,
      hora: a.hora,
      estado: a.estado.toLowerCase(),
    }));

    const presentesSet = new Set(presentes.map((p) => p.nombres));

    const faltantes = empleados
      .filter((e) => !presentesSet.has(`${e.nombre} ${e.apellido}`))
      .map((e) => ({
        id: e.id,
        nombres: `${e.nombre} ${e.apellido}`,
        email: e.email,
        turno: e.turno?.nombre || null,
      }));

    const tardanzasList = asistenciasHoy
      .filter((a) => a.estado === 'TARDE')
      .map((a) => ({
        nombres: `${a.empleado.nombre} ${a.empleado.apellido}`,
        hora: a.hora,
        estado: 'tarde',
      }));

    return {
      stats: {
        empleados: totalEmpleados,
        hoy: totalHoy,
        tarde: tardanzas,
        faltan: Math.max(0, faltan),
      },
      presentes,
      empleados: empleados.map((e) => ({
        id: e.id,
        nombres: `${e.nombre} ${e.apellido}`,
        email: e.email,
        turno: e.turno?.nombre || null,
      })),
      faltantes,
      tardanzasList,
    };
  }
}