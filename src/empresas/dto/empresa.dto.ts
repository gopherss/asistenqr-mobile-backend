import { IsString, IsOptional, IsInt, Min, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @ApiProperty({ example: 'Empresa Demo' })
  @IsString()
  public readonly nombre: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  public readonly maxEmpleados: number;

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  public readonly adminNombre: string;

  @ApiProperty({ example: 'García' })
  @IsString()
  public readonly adminApellido: string;

  @ApiProperty({ example: 'admin@empresa.com' })
  @IsEmail()
  public readonly adminEmail: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  public readonly adminPassword: string;
}

export class UpdateEmpresaDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly nombre?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  public readonly maxEmpleados?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  public readonly activo?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly adminNombre?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly adminApellido?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly adminEmail?: string;
}