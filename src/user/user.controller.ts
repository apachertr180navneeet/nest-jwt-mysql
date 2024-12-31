import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private handleError(message: string, status: HttpStatus) {
    throw new HttpException({ success: false, message }, status);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, schema: { example: { success: true, data: [] } } })
  @ApiResponse({ status: 500, schema: { example: { success: false, message: 'Failed to retrieve users.' } } })
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return { success: true, data: users };
    } catch (error) {
      this.handleError('Failed to retrieve users.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, schema: { example: { success: true, data: {} } } })
  @ApiResponse({ status: 404, schema: { example: { success: false, message: 'User not found.' } } })
  async findOne(@Param('id') id: number) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      this.handleError('User not found.', HttpStatus.NOT_FOUND);
    }
    return { success: true, data: user };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, schema: { example: { success: true, message: 'User updated successfully.', data: {} } } })
  @ApiResponse({ status: 404, schema: { example: { success: false, message: 'User not found.' } } })
  @ApiResponse({ status: 400, schema: { example: { success: false, message: 'Invalid input data.' } } })
  async update(@Param('id') id: number, @Body() updateData: UpdateUserDto) {
    const updatedUser = await this.userService.update(id, updateData);
    if (!updatedUser) {
      this.handleError('User not found.', HttpStatus.NOT_FOUND);
    }
    return { success: true, message: 'User updated successfully.', data: updatedUser };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, schema: { example: { success: true, message: 'User deleted successfully.' } } })
  @ApiResponse({ status: 400, schema: { example: { success: false, message: 'Cannot delete user. Related posts exist.' } } })
  @ApiResponse({ status: 404, schema: { example: { success: false, message: 'User not found.' } } })
  async remove(@Param('id') id: number) {
    try {
      // Check for related posts before deletion
      const hasRelatedPosts = await this.userService.hasRelatedPosts(id);
      if (hasRelatedPosts) {
        this.handleError('Cannot delete user. Related posts exist.', HttpStatus.BAD_REQUEST);
      }

      // Proceed with deletion
      const deleted = await this.userService.remove(id);
      if (!deleted) {
        this.handleError('User not found.', HttpStatus.NOT_FOUND);
      }
      return { success: true, message: 'User deleted successfully.' };
    } catch (error) {
      this.handleError('Internal server error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
