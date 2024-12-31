// src/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Username for the user',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'securePassword123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: UserRole.USER,
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
