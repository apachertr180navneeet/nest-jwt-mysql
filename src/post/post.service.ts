// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Import entities
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(postData: Partial<Post>, user: User): Promise<Post> {
    const post = this.postsRepository.create({ ...postData, author: user });
    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updateData: Partial<Post>): Promise<Post> {
    await this.postsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
