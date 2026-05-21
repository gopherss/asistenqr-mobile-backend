import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { QrTokensService } from './qr-tokens.service';

@ApiTags('QR Tokens')
@ApiBearerAuth()
@Controller('qr-tokens')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QrTokensController {
  constructor(private service: QrTokensService) {}

  @Post('generate')
  @Roles(Role.TERMINAL)
  @ApiOperation({ summary: 'Generar token QR (terminal)' })
  generate() {
    return this.service.generate();
  }
}