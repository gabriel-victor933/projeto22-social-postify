import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { PublicationsRepositories } from './publications.repositories';

@Module({
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepositories]
})
export class PublicationsModule {}
