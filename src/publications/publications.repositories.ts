import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dtos/publications.dto';

@Injectable()
export class PublicationsRepositories {
    constructor(private readonly prismaService: PrismaService){}

    createPublication(body: CreatePublicationDto){
        return this.prismaService.publications.create({data: {...body,date: new Date(body.date)}})
    }

    getPublication(published: boolean | void, after: Date | void) {

        const listWhere = []
        if(typeof published === "boolean"){
            
            if(published == true){
                listWhere.push({date: {lte: new Date()}})
            } else {
                listWhere.push({date: {gt: new Date()}})
            }
        }
        
        if(after){
            listWhere.push({date: {gte: new Date(after)}})
        }
        
        return this.prismaService.publications.findMany({where: {AND: listWhere}})
    }

    getFuturePublicationsInfos(){
        return this.prismaService.publications.findMany({
            where: {AND: [
                {date: {gt: new Date(Date.now())}},
                {date: {lt: new Date(Date.now()+60000)}}
            ]},
            select: {
                date: true,
                media: {
                    select: {
                        title: true,
                        username: true
                    }
                },
                post: {
                    select: {
                        title: true,
                        text: true,
                        image: true
                    }
                }
            }
        })
    }

    getPublicationById(id: number){
        return this.prismaService.publications.findMany({where: {id}});
    }

    deletePublication(id: number){
        return this.prismaService.publications.delete({
            where: {id}
        })
    }

    updatePublication(body: CreatePublicationDto, id: number){
        return this.prismaService.$transaction(async (tx) => {
            const publication = await tx.publications.findUnique({where: {id}})
            
            if(!publication) throw new NotFoundException("Publication not found")
            if(publication.date < new Date()) throw new ForbiddenException("Publication has already been posted ")

            const media = await tx.medias.findUnique({where: {id: body.mediaId}})
            if(!media) throw new NotFoundException("Media not found") 

            const post = await tx.posts.findUnique({where: {id: body.postId}})
            if(!post) throw new NotFoundException("Post not found") 

            await tx.publications.update({
                where: {id},
                data: body
            })
        })
    }
}