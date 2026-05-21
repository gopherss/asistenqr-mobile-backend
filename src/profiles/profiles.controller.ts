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
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@ApiTags('Profiles')
@ApiBearerAuth()
@Controller('profiles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfilesController {
  constructor(private service: ProfilesService) {}

  @Get()
  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Listar todos los perfiles' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Obtener perfil por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Actualizar perfil' })
  update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/toggle-status')
  @Roles(Role.DIRECTOR)
  @ApiOperation({ summary: 'Activar/desactivar perfil' })
  toggleStatus(@Param('id') id: string) {
    return this.service.toggleStatus(id);
  }
}