import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseSuccess, ApiResponseError } from '../auth/dto/api-response.dto';

@ApiTags('Authentication') // Groups endpoints under 'Authentication'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   * @param registerDto - DTO containing user registration details
   * @returns Custom API response with status and message
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    type: ApiResponseError,
  })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return this.createSuccessResponse(HttpStatus.CREATED, 'User successfully registered.', user);
    } catch (error) {
      return this.createErrorResponse(error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * User login
   * @param loginDto - DTO containing login credentials
   * @returns Custom API response with status and token
   */
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
    type: ApiResponseError,
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    // Check if user is valid
    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials.',
      });
    }

    const token = await this.authService.login(user);
    return this.createSuccessResponse(HttpStatus.OK, 'User successfully logged in.', { token });
  }

  /**
   * Utility method to create a standard success response
   * @param statusCode - HTTP status code
   * @param message - Success message
   * @param data - Optional response data
   * @returns API success response object
   */
  private createSuccessResponse(statusCode: number, message: string, data?: any) {
    return {
      statusCode,
      message,
      data,
    };
  }

  /**
   * Utility method to handle error responses in a standard format
   * @param error - Error object
   * @param statusCode - HTTP status code
   * @returns API error response object
   */
  private createErrorResponse(error: any, statusCode: number) {
    const message = error?.message || 'Something went wrong';
    return {
      statusCode,
      message,
      error: message,
    };
  }
}
