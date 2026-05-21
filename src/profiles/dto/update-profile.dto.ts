import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly nombres?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly dni?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly telefono?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public readonly turnoId?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public readonly estado?: boolean;
}