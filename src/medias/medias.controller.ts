import { Body, Controller, ParseIntPipe, Post, Put, Param } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dtos/medias.dto';

@Controller('medias')
export class MediasController {

    constructor(private readonly mediasService: MediasService){}

    @Post()
    async createMedia(@Body() body: CreateMediaDto){
        await this.mediasService.createMedia(body);
    }

    @Put("/:id")
    async updateMedia(@Body() body: CreateMediaDto, @Param("id",ParseIntPipe) id: number){
        await this.mediasService.updateMedia(body,id)
    }
}
