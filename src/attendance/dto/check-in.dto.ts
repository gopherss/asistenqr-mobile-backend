import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckInDto {
  @ApiProperty({ example: 'hmac_token_aqui' })
  @IsString()
  public readonly qrToken: string;
}