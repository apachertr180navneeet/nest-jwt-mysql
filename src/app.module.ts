import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // Update if different
      port: 3306,        // Default MySQL port
      username: 'root',
      password: '',
      database: 'nest_jwt_mysql',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Disable in production
    }),
    UserModule,
    AuthModule,
    PostModule,

  ],
})
export class AppModule {}
