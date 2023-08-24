import { NotFoundException, Injectable } from '@nestjs/common';
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

    async getMedias(){
        return await this.mediasRepositories.getMedias();
    }

    async getMediaById(id: number){
        const media = await this.mediasRepositories.getMediaById(id);
        if(media.length === 0) throw new NotFoundException("Media Not Found")
        return media
    }

    async deleteMedia(id: number){
        await this.mediasRepositories.deleteMedia(id);
    }
}
