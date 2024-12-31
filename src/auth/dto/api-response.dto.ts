// src/dto/api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseSuccess {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'User successfully registered.' })
  message: string;

  @ApiProperty({
    example: {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    },
    nullable: true,
  })
  data?: any;

  @ApiProperty({
    example: 'jwt-token-here',
    nullable: true,
  })
  token?: string;
}

export class ApiResponseError {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Invalid input.' })
  message: string;

  @ApiProperty({ example: 'Email already exists.', nullable: true })
  error?: string;
}
