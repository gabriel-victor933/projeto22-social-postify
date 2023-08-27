import {faker} from '@faker-js/faker'
import { PrismaService } from '../../src/prisma/prisma.service'
import { createMedia } from './medias.factories'
import { createPost } from './posts.factories'

export  function createPublication(prisma: PrismaService,  isPublished: boolean,mediaId: number | void, postId: number | void){
    return prisma.$transaction(async (tx) => {
        let media: any = {id: mediaId}
        let post: any = {id: postId}

        if(!media.mediaId){
            media = await createMedia(prisma)
        }

        if(!post.postId){
            post = await createPost(prisma)
        }

        return await prisma.publications.create({
            data: {
                mediaId: media.id,
                postId: post.id,
                date: isPublished ? faker.date.past(): faker.date.future()
            }
        })
    })
}