import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateEmpresaDto, UpdateEmpresaDto } from './dto/empresa.dto';
import { EmpresasService } from './empresas.service';

@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('empresas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPERADMIN)
export class EmpresasController {
  constructor(private service: EmpresasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva empresa' })
  create(@Body() dto: CreateEmpresaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las empresas' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empresa por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar empresa' })
  update(@Param('id') id: string, @Body() dto: UpdateEmpresaDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'Activar/desactivar empresa' })
  toggleStatus(@Param('id') id: string) {
    return this.service.toggleStatus(id);
  }
}