// src/post/dto/create-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My Post Title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Post content goes here' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
