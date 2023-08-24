import { Module } from '@nestjs/common';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediasRepositories } from './medias.repositories';

@Module({
  controllers: [MediasController],
  providers: [MediasService, MediasRepositories]
})
export class MediasModule {}
