import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Post } from '../post/entities/post.entity'; // Import Post entity
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])], // Register repositories
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Export for use in AuthModule
})
export class UserModule {}
