import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MediasModule } from './medias/medias.module';
import { PublicationsModule } from './publications/publications.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './schedule/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PostsModule, 
    MediasModule, 
    PublicationsModule, 
    PrismaModule, 
    MailModule,
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
    transport: {
      host: "smtp.mailgun.org",
      port: 587,
      auth: {
        user: "postmaster@sandbox076fdffd73244aff8cf71fc4516df4bd.mailgun.org",
        pass: "5aad1845f67ce37fb323d85f07913dd0-451410ff-ed264dd9"
      }
    },
      
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
