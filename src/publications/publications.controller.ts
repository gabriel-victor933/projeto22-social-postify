import { Body, Controller, InternalServerErrorException, NotFoundException, Post, Get, Put, Delete, Param, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import {  CreatePublicationDto, QueryDto } from './dtos/publications.dto';
import { query } from 'express';
import { type } from 'os';

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
    async getPublications(@Query() query: QueryDto ){
        let published: boolean | void;
        if(query.published){
            published = (query.published === "true") 
        }
        
        return await this.publicationServices.getPublications(published,query.after)
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
            await this.publicationServices.updatePublication(body,id);
    }

}
