// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column , OneToMany } from 'typeorm';

import { Post } from '../../post/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}
