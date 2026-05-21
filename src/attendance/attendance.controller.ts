import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AttendanceService } from './attendance.service';
import { CheckInDto } from './dto/check-in.dto';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private service: AttendanceService) {}

  @Post('check-in')
  @ApiOperation({ summary: 'Registrar asistencia con QR (docente)' })
  checkIn(@CurrentUser('id') userId: string, @Body() dto: CheckInDto) {
    return this.service.checkIn(userId, dto.qrToken);
  }

  @Get('history')
  @ApiOperation({ summary: 'Historial de asistencias del docente autenticado' })
  history(@CurrentUser('id') userId: string) {
    return this.service.history(userId);
  }

  @Get('missed-dates')
  @ApiOperation({ summary: 'Fechas faltantes del docente autenticado' })
  missedDates(@CurrentUser('id') userId: string) {
    return this.service.missedDates(userId);
  }

  @Get('by-date/:date')
  @UseGuards(RolesGuard)
  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Asistencia de todos los docentes en una fecha' })
  byDate(@Param('date') date: string) {
    return this.service.byDate(date);
  }

  @Get('today')
  @UseGuards(RolesGuard)
  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Asistencias del día de hoy' })
  today() {
    return this.service.today();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Estadísticas del dashboard' })
  stats() {
    return this.service.stats();
  }
}