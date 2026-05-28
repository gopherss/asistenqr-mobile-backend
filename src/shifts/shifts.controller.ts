import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftsService } from './shifts.service';

@ApiTags('Shifts')
@ApiBearerAuth()
@Controller('shifts')
@UseGuards(JwtAuthGuard)
export class ShiftsController {
  constructor(private service: ShiftsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los turnos de la empresa' })
  findAll(@CurrentUser('empresaId') empresaId: string) {
    return this.service.findAll(empresaId);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar turno' })
  update(@Param('id') id: string, @Body() dto: UpdateShiftDto, @CurrentUser('empresaId') empresaId: string) {
    return this.service.update(id, dto, empresaId);
  }
}