import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PublicationsRepositories } from '../publications/publications.repositories';
import { MailService } from './mail.service';

@Injectable()
export class ScheduleService  {
    private readonly logger = new Logger(ScheduleService.name)

    constructor(private readonly publicationsRepositories: PublicationsRepositories,
        private readonly mailService: MailService){}
   
    @Cron("* * * * * *",{
        timeZone: "America/Sao_Paulo"
    })
    async handleCron(){
        const publications = await this.publicationsRepositories.getFuturePublicationsInfos()
        console.log(`${process.env.LOGIN} `)
        if(publications.length !== 0){
            console.log("emails")
            console.log(publications)
            publications.forEach((pub)=>{
                this.mailService.sendEmail(pub)
            })
        }
    }
}
