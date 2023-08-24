import { Body, Controller, InternalServerErrorException, NotFoundException, Post, Get, Put, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dtos/publications.dto';

@Controller('publications')
export class PublicationsController {
    constructor(private readonly publicationServices: PublicationsService){}

    @Post()
    async createPublication(@Body() body: CreatePublicationDto ){

        try {
            await this.publicationServices.createPublication(body)
        } catch(err){
            if(err.code === "P2003") throw new NotFoundException("MediaId or PostId Not Found");
            throw new InternalServerErrorException("Error")
        }

    }

    @Get()
    async getPublications(){
        return await this.publicationServices.getPublications()
    }   

    @Get("/:id")
    async getPublicationById(@Param("id",ParseIntPipe) id: number ){
        return await this.publicationServices.getPublicationById(id);
    }

    @Delete("/:id")
    async deletePublication(@Param("id",ParseIntPipe) id: number){
         await this.publicationServices.deletePublication(id)
    }

    @Put("/:id")
    async updatePublication(@Param("id",ParseIntPipe) id: number, @Body() body: CreatePublicationDto){
        try {
            await this.publicationServices.updatePublication(body,id);
        } catch(err){
            if(err.code === "P2003") throw new NotFoundException("MediaId or PostId Not Found");
            throw new InternalServerErrorException("Error")
        }
    }

}
