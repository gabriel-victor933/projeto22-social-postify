import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicationDto } from './dtos/publications.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PublicationsRepositories {
    constructor(private readonly prismaService: PrismaService){}

    createPublication(body: CreatePublicationDto){
        return this.prismaService.publications.create({data: body})
    }

    getPublication(published: boolean | void, after: Date | void) {

        const listWhere = []
        console.log(typeof published)
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

            await tx.publications.update({
                where: {id},
                data: body
            })
        })
    }
}