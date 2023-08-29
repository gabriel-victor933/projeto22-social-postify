import { Module } from '@nestjs/common';
import { ScheduleService } from "./schedule.service"
import { PublicationsModule } from 'src/publications/publications.module';
import { MailService } from './mail.service';

@Module({
  imports: [PublicationsModule],
  providers: [ ScheduleService, MailService]
})
export class ScheduleModule {}
