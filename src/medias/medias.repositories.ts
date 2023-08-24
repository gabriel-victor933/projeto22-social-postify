import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

    getMedias(){
        return this.prismaService.medias.findMany()
    }

    getMediaById(id: number){
        return this.prismaService.medias.findMany({
            where: {id}
        })
    }

    deleteMedia(id: number){
        return this.prismaService.medias.delete({
            where: {
                id
            }
        })
    }
}