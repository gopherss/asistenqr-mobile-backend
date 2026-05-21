import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { EstadoAsistencia } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIn(userId: string, qrToken: string) {
    const secret = process.env.TERMINAL_SECRET || 'terminal-secret';

    const [timestampStr, signature] = qrToken.split('.');
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) {
      throw new BadRequestException('Token QR inválido');
    }

    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (Math.abs(diff) > 10) {
      throw new BadRequestException('QR expirado');
    }

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(timestampStr)
      .digest('hex');

    if (signature !== expectedSig) {
      throw new ForbiddenException('Token QR inválido');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: { turno: true },
    });

    if (!profile || !profile.estado) {
      throw new ForbiddenException('Perfil no encontrado o inactivo');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.asistencia.findFirst({
      where: {
        docenteId: userId,
        fecha: today,
      },
    });

    if (existing) {
      throw new BadRequestException('Ya registraste asistencia hoy');
    }

    const nowDate = new Date();
    const currentHour =
      nowDate.getHours().toString().padStart(2, '0') +
      ':' +
      nowDate.getMinutes().toString().padStart(2, '0') +
      ':00';

    const horaLimite = profile.turno?.horaTolerancia || '07:15:00';
    const estado: EstadoAsistencia =
      currentHour > horaLimite ? EstadoAsistencia.TARDE : EstadoAsistencia.PUNTUAL;

    const asistencia = await this.prisma.asistencia.create({
      data: {
        docenteId: userId,
        fecha: today,
        hora: currentHour,
        estado,
        metodo: 'qr',
      },
    });

    return {
      id: asistencia.id,
      hora: asistencia.hora,
      estado: asistencia.estado.toLowerCase(),
      mensaje:
        estado === 'PUNTUAL'
          ? 'Asistencia registrada correctamente'
          : 'Llegaste tarde',
    };
  }

  async history(userId: string) {
    const registros = await this.prisma.asistencia.findMany({
      where: { docenteId: userId },
      orderBy: { fecha: 'desc' },
    });

    return registros.map((r) => ({
      ...r,
      fecha: r.fecha.toISOString().split('T')[0],
    }));
  }

  async today() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const asistencias = await this.prisma.asistencia.findMany({
      where: { fecha: today },
      include: {
        docente: {
          select: { nombres: true },
        },
      },
      orderBy: { hora: 'asc' },
    });

    return asistencias.map((a) => ({
      nombres: a.docente.nombres,
      hora: a.hora,
      estado: a.estado.toLowerCase(),
    }));
  }

  async missedDates(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startFrom = profile?.createdAt
      ? new Date(Math.max(startOfMonth.getTime(), profile.createdAt.getTime()))
      : startOfMonth;

    const asistencias = await this.prisma.asistencia.findMany({
      where: { docenteId: userId },
      select: { fecha: true },
    });

    const attendedDates = new Set(
      asistencias.map((a) => a.fecha.toISOString().split('T')[0]),
    );

    const missed: string[] = [];
    const current = new Date(startFrom);

    while (current < today) {
      const dayOfWeek = current.getDay();
      const dateStr = current.toISOString().split('T')[0];

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !attendedDates.has(dateStr)) {
        missed.push(dateStr);
      }

      current.setDate(current.getDate() + 1);
    }

    return missed;
  }

  async byDate(date: string) {
    const targetDate = new Date(date + 'T00:00:00.000Z');
    const targetDateEnd = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    const docentes = await this.prisma.profile.findMany({
      where: { rol: 'DOCENTE', estado: true },
      select: {
        id: true,
        nombres: true,
        createdAt: true,
        turno: { select: { nombre: true } },
      },
      orderBy: { nombres: 'asc' },
    });

    const asistencias = await this.prisma.asistencia.findMany({
      where: { fecha: targetDate },
      select: { docenteId: true, hora: true, estado: true },
    });

    const asistenciaMap = new Map(
      asistencias.map((a) => [a.docenteId, { hora: a.hora, estado: a.estado.toLowerCase() }]),
    );

    return docentes
      .filter((d) => d.createdAt < targetDateEnd)
      .map((d) => ({
        id: d.id,
        nombres: d.nombres,
        turno: d.turno?.nombre || null,
        asistencia: asistenciaMap.get(d.id) || null,
      }));
  }

  async stats() {
    const totalDocentes = await this.prisma.profile.count({
      where: { rol: 'DOCENTE' },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const asistenciasHoy = await this.prisma.asistencia.findMany({
      where: { fecha: today },
    });

    const totalHoy = asistenciasHoy.length;
    const tardanzas = asistenciasHoy.filter(
      (a) => a.estado === 'TARDE',
    ).length;
    const faltan = totalDocentes - totalHoy;

    return {
      docentes: totalDocentes,
      hoy: totalHoy,
      tarde: tardanzas,
      faltan: Math.max(0, faltan),
    };
  }
}
