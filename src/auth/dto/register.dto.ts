import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'empleado@empresa.com' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  public readonly  password: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  public readonly nombre: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  public readonly apellido: string;

  @ApiProperty({ required: false, example: 'uuid-del-turno' })
  @IsString()
  @IsOptional()
  public readonly turnoId?: string;
}