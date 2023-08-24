import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediasRepositories {
    constructor(private readonly prismaService: PrismaService){}

    createMedia(title: string, username: string){
        return this.prismaService.medias.create({
            data: {title,username}
        })    
    }

    updateMedia(title: string, username: string, id: number){
        return this.prismaService.medias.update({
            where: {id: id},
            data: {title, username}
        })
    }
}