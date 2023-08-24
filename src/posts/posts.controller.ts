import { Body, Controller, Param, ParseIntPipe, Post, Put, Get, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/posts.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postServices: PostsService){}

    @Post()
    async createPost(@Body() body: CreatePostDto){
        this.postServices.createPost(body)
    }

    @Put("/:id")
    async updatePost(@Body() body: CreatePostDto, @Param("id",ParseIntPipe) id: number){
        await this.postServices.updatePost(body,id);
    }

    @Get()
    async getPosts(){
        return await this.postServices.getPosts();
    }

    @Get("/:id")
    async getPostById(@Param("id",ParseIntPipe) id: number){
        return await this.postServices.getPostById(id);
    }

    @Delete("/:id")
    async deletePost(@Param("id",ParseIntPipe) id: number){
        await this.postServices.deletePost(id);
    }
}
