import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateShiftDto {
  @ApiProperty({ required: false, example: '08:00' })
  @IsString()
  @IsOptional()
  public readonly horaEntrada?: string;

  @ApiProperty({ required: false, example: '15' })
  @IsString()
  @IsOptional()
  public readonly horaTolerancia?: string;

  @ApiProperty({ required: false, example: '17:00' })
  @IsString()
  @IsOptional()
  public readonly horaSalida?: string;
}