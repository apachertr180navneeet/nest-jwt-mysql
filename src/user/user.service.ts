// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { Post } from '../post/entities/post.entity'; // Import Post entity

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>, // Inject Post Repository
  ) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id },
    });
    
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findOneById(id);
  }

  async hasRelatedPosts(userId: number): Promise<boolean> {
    // Preferred: Query using relations
    const count = await this.postRepository.count({
      where: {
        author: { id: userId }, // Use relation
      },
    });
  
    // Alternatively, use raw SQL (if needed)
    // const count = await this.postRepository
    //   .createQueryBuilder('post')
    //   .where('post.authorId = :userId', { userId })
    //   .getCount();
  
    return count > 0; // Return true if related posts exist
  }
  

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0; // Return true if deletion was successful
  }
  
  
}
