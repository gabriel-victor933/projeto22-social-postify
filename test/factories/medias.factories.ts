import {faker} from '@faker-js/faker'
import { PrismaService } from '../../src/prisma/prisma.service'

export  function createMedia(prisma: PrismaService){
    return  prisma.medias.create({
        data: {
            title: faker.word.words({ count: { min: 5, max: 10 } }),
            username: faker.internet.userName()
        }
    })
}