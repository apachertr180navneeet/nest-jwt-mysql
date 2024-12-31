// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'securePassword123',
  })
  @IsString()
  password: string;
}
