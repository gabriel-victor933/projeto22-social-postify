import { Injectable } from '@nestjs/common';
import cron from "node-cron"
import { MailService } from './mail.service';

@Injectable()
export class ScheduleService {

    cronSchedule: cron.ScheduledTask
    constructor( private readonly mailService: MailService){}

    createSchedule(scheduleFunction: Function, seconds: string){
        this.cronSchedule = cron.schedule("*/15 * * * *",()=>{
            scheduleFunction
        },{
            scheduled: true,
            timezone: "America/Sao_Paulo"
          })
    }

    stopSchedule(){
        this.cronSchedule.stop()
    }

}
