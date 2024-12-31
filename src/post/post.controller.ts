import { Controller, Get, Post as HttpPost, Put, Delete, Param, Body, UseGuards, Request, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponseSuccess, ApiResponseError } from './dto/api-response.dto'; // Correct import path for API response models

@Controller('posts')
@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Apply guard globally for protected routes
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Helper method for standard responses
  private standardResponse(statusCode: number, message: string, data?: any) {
    return { statusCode, message, data };
  }

  // Create a new post (protected)
  @HttpPost()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'Post successfully created.',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    type: ApiResponseError,
  })
  async create(@Body() createPostDto: CreatePostDto, @Request() req) {
    try {
      const post = await this.postService.create(createPostDto, req.user);
      return this.standardResponse(201, 'Post successfully created.', post);
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Server error while creating post.',
        error: error.message,
      });
    }
  }

  // Get all posts (public)
  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'List of posts retrieved successfully.',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: 500,
    description: 'Server error.',
    type: ApiResponseError,
  })
  async findAll() {
    try {
      const posts = await this.postService.findAll();
      return this.standardResponse(200, 'Posts retrieved successfully.', posts);
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Server error while retrieving posts.',
        error: error.message,
      });
    }
  }

  // Get a single post by ID (public)
  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully.',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    type: ApiResponseError,
  })
  async findOne(@Param('id') id: number) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return this.standardResponse(200, 'Post retrieved successfully.', post);
  }

  // Update a post by ID (protected)
  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 200,
    description: 'Post successfully updated.',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    type: ApiResponseError,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    type: ApiResponseError,
  })
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    try {
      const updatedPost = await this.postService.update(id, updatePostDto);
      return this.standardResponse(200, 'Post successfully updated.', updatedPost);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Post not found.');
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Server error while updating post.',
        error: error.message,
      });
    }
  }

  // Delete a post by ID (protected)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'Post successfully deleted.',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
    type: ApiResponseError,
  })
  async remove(@Param('id') id: number) {
    try {
      const result = await this.postService.remove(id);
      return this.standardResponse(200, 'Post successfully deleted.', result);
    } catch (error) {
      throw new NotFoundException('Post not found.');
    }
  }
}
