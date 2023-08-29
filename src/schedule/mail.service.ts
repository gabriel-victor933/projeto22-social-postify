import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ScheduleService } from './schedule.service';


@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    sendEmail(pub: Pub){
        this.mailerService.sendMail({
            to: 'gabrielvictor933@usp.br', // list of receivers
            from: 'noreply@nestjs.com', // sender address
            subject: 'SOCIAL-POSTIFY: Time to Post', // Subject line
            text: ``, // plaintext body
            html: `
                <h3>This publication was schedule to be post at ${pub.media.title} 
                using ${pub.media.username} at the time ${pub.date}</h3>
                <h2><b>title:</b>${pub.post.title}</h2>
                <h2><b>text:</b>${pub.post.text}</h2>
                <h2><b>image:</b>${pub.post.image ? pub.post.image :  ""}</h2>
            `, // HTML body content
        })
    }
}

type Pub = {
    date: Date;
    media: {
        title: string;
        username: string;
    };
    post: {
        title: string;
        text: string;
        image: string;
    };
}