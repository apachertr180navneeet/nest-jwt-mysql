// src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Unique username for the user',
    example: 'john_doe',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'securePassword123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
