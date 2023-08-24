import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dtos/posts.dto';

@Injectable()
export class PostsRepositories {
    constructor(private readonly prismaService: PrismaService){}

    createPost(title: string,text: string, image: string | undefined){
        return this.prismaService.posts.create({
            data: {
                title,
                text,
                image
            }
        })
    }

    updatePost(body: CreatePostDto, id: number){
        return this.prismaService.posts.update({
            where: {id},
            data: body
        })
    }

    getPosts(){
        return this.prismaService.posts.findMany()
    }

    getPostById(id: number){
        return this.prismaService.posts.findMany({
            where: {id}
        })
    }

    deletePost(id: number){
        return this.prismaService.posts.delete({
            where: {id}
        })
    }
}