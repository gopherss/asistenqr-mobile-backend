import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'docente@colegio.com' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  public readonly  password: string;

  @ApiProperty({ example: 'Docente Nuevo' })
  @IsString()
  public readonly nombres: string;

  @ApiProperty({ required: false, example: '12345678' })
  @IsString()
  @IsOptional()
  public readonly dni?: string;

  @ApiProperty({ required: false, example: '999888777' })
  @IsString()
  @IsOptional()
  public readonly telefono?: string;

  @ApiProperty({ required: false, example: 'uuid-del-turno' })
  @IsString()
  @IsOptional()
  public readonly turnoId?: string;
}