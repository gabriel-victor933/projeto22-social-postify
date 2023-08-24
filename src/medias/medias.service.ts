import { Injectable } from '@nestjs/common';
import { MediasRepositories } from './medias.repositories';
import { CreateMediaDto } from './dtos/medias.dto';

@Injectable()
export class MediasService {
    constructor(private readonly mediasRepositories: MediasRepositories){}

    async createMedia(body: CreateMediaDto){
        await this.mediasRepositories.createMedia(body.title,body.username);
    }

    async updateMedia(body: CreateMediaDto, id: number){
        await this.mediasRepositories.updateMedia(body.title,body.username,id)
    }
}
