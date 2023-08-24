import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepositories } from './posts.repositories';
import { CreatePostDto } from './dtos/posts.dto';

@Injectable()
export class PostsService {

    constructor(private readonly postsRepositories: PostsRepositories){}

    async createPost(body: CreatePostDto){
        await this.postsRepositories.createPost(body.title, body.text, body.image);
    }

    async updatePost(body: CreatePostDto, id: number){
        await this.postsRepositories.updatePost(body,id)
    }

    async getPosts(){
        return await this.postsRepositories.getPosts()
    }

    async getPostById(id: number){
        const post = await this.postsRepositories.getPostById(id)
        if(post.length === 0) throw new NotFoundException("Post Not Found")
        return post
    }

    async deletePost(id: number){
        await this.postsRepositories.deletePost(id);
    }
}
