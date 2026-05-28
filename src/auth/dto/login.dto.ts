import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@empresa.com' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ example: 'admin1234' })
  @IsString()
  @MinLength(6)
  public readonly password: string;
}