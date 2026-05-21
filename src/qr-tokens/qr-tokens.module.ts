import { Module } from '@nestjs/common';
import { QrTokensController } from './qr-tokens.controller';
import { QrTokensService } from './qr-tokens.service';

@Module({
  controllers: [QrTokensController],
  providers: [QrTokensService],
})
export class QrTokensModule {}
