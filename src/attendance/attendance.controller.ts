import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
  @ApiOperation({ summary: 'Registrar asistencia con QR (empleado)' })
  checkIn(@CurrentUser('id') userId: string, @CurrentUser('empresaId') empresaId: string, @Body() dto: CheckInDto) {
    return this.service.checkIn(userId, empresaId, dto.qrToken);
  }

  @Get('history')
  @ApiOperation({ summary: 'Historial de asistencias del empleado autenticado' })
  history(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.history(userId, cursor, limit ? parseInt(limit, 10) : 20);
  }

  @Get('missed-dates')
  @ApiOperation({ summary: 'Fechas faltantes del empleado autenticado' })
  missedDates(@CurrentUser('id') userId: string) {
    return this.service.missedDates(userId);
  }

  @Get('by-date/:date')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Asistencia de todos los empleados en una fecha' })
  byDate(@Param('date') date: string, @CurrentUser('empresaId') empresaId: string) {
    return this.service.byDate(date, empresaId);
  }

  @Get('today')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Asistencias del día de hoy' })
  today(@CurrentUser('empresaId') empresaId: string) {
    return this.service.today(empresaId);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Estadísticas del dashboard' })
  stats(@CurrentUser('empresaId') empresaId: string) {
    return this.service.stats(empresaId);
  }
}