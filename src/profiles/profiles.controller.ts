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
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('Perfiles')
@ApiBearerAuth()
@Controller('perfiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfilesController {
  constructor(private service: ProfilesService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los empleados de la empresa' })
  findAll(@CurrentUser('empresaId') empresaId: string) {
    return this.service.findAll(empresaId);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  findOne(@Param('id') id: string, @CurrentUser('empresaId') empresaId: string) {
    return this.service.findOne(id, empresaId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar perfil' })
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto, @CurrentUser('empresaId') empresaId: string) {
    return this.service.update(id, dto, empresaId);
  }

  @Patch(':id/toggle-status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Activar/desactivar perfil' })
  toggleStatus(@Param('id') id: string, @CurrentUser('empresaId') empresaId: string) {
    return this.service.toggleStatus(id, empresaId);
  }
}