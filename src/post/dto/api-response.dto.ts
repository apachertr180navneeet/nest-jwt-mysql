// src/post/dto/api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseSuccess {
  @ApiProperty({ description: 'The status code of the response', example: 200 })
  statusCode: number;

  @ApiProperty({ description: 'Message describing the response', example: 'Operation successful.' })
  message: string;

  @ApiProperty({ description: 'Data related to the response', example: {} })
  data: any;
}

export class ApiResponseError {
  @ApiProperty({ description: 'The status code of the error response', example: 400 })
  statusCode: number;

  @ApiProperty({ description: 'Error message', example: 'Invalid input.' })
  message: string;

  @ApiProperty({ description: 'Detailed error description', example: 'The input data does not meet the required format.' })
  error: string;
}
