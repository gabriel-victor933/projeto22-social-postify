import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepositories } from './posts.repositories';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsRepositories]
})
export class PostsModule {}
