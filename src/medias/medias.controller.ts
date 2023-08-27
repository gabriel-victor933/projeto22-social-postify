import { Body, Controller, ParseIntPipe, Post, Put, Param, Get, Delete } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dtos/medias.dto';

@Controller('medias')
export class MediasController {

    constructor(private readonly mediasService: MediasService){}

    @Post()
    async createMedia(@Body() body: CreateMediaDto){

        try {
            await this.mediasService.createMedia(body);
        } catch(err){
            console.log(err);
            console.log(err.code)
            throw new Error("teste")
        }
        
    }

    @Put("/:id")
    async updateMedia(@Body() body: CreateMediaDto, @Param("id",ParseIntPipe) id: number){
        await this.mediasService.updateMedia(body,id)
    }

    @Get()
    async getMedias(){
        return await this.mediasService.getMedias();
    }

    @Get("/:id")
    async getMedia(@Param("id", ParseIntPipe) id: number){
        return this.mediasService.getMediaById(id);
    }

    @Delete("/:id")
    async deleteMedia(@Param("id",ParseIntPipe) id: number){
        
            await this.mediasService.deleteMedia(id);
    }
}
