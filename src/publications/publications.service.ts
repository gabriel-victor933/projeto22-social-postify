import { Injectable } from '@nestjs/common';
import { PublicationsRepositories } from './publications.repositories';
import { CreatePublicationDto } from './dtos/publications.dto';

@Injectable()
export class PublicationsService {
    constructor(private readonly publicationRepositories: PublicationsRepositories){}

    async createPublication(body: CreatePublicationDto){
        await this.publicationRepositories.createPublication(body);
    }

    async getPublications(){
        return await this.publicationRepositories.getPublication()
    }

    async getPublicationById(id: number){
        return await this.publicationRepositories.getPublicationById(id);
    }

    async deletePublication(id: number){
         await this.publicationRepositories.deletePublication(id)
    }

    async updatePublication(body: CreatePublicationDto, id: number){
        await this.publicationRepositories.updatePublication(body,id)
    }
}
