import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  public readonly email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly nombre?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly apellido?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly turnoId?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public readonly estado?: boolean;
}