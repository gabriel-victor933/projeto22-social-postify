import {faker} from '@faker-js/faker'
import { PrismaService } from '../../src/prisma/prisma.service'

export  function createPost(prisma: PrismaService){
    return  prisma.posts.create({
        data: {
            text: faker.word.words({ count: { min: 10, max: 20 } }),
            title: faker.word.words({ count: { min: 5, max: 10 } }),
            image: faker.image.url()
        }
    })
}