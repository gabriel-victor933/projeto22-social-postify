import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ScheduleService } from './schedule.service';


@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    sendEmail(text: string){
        this.mailerService.sendMail({
            to: 'gabrielvictor933@usp.br', // list of receivers
            from: 'noreply@nestjs.com', // sender address
            subject: 'Time to Post', // Subject line
            text: 'welcome', // plaintext body
            html: '<b>welcome</b>', // HTML body content
        })
    }
}
