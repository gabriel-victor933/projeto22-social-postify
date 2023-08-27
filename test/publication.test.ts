import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus,    } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost  } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { createPublication } from './factories/publications.factories';
import { createPost } from './factories/posts.factories';
import { createMedia } from './factories/medias.factories';


describe('"/publications" integration test', () => {
  let app: INestApplication;
  let prisma: PrismaService

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, PrismaModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        
        app.useGlobalPipes(new ValidationPipe())

      const { httpAdapter } = app.get(HttpAdapterHost)
      app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter, {
        P2003: HttpStatus.FORBIDDEN,
        P2000: HttpStatus.BAD_REQUEST,
        P2002: HttpStatus.CONFLICT,
        P2025: HttpStatus.NOT_FOUND,
      }))
        
        prisma = await moduleFixture.resolve(PrismaService)
        await prisma.publications.deleteMany()
        await prisma.posts.deleteMany()
        await prisma.medias.deleteMany()
        
        await app.init();
        
    });

  it("/publications POST with invalid body should return 400", async () => {
    await request(app.getHttpServer())
    .post("/publications")
    .send({})
    .expect(400)
  })

  it("/publications POST with invalid record should return 403", async () => {
    await request(app.getHttpServer())
    .post("/publications")
    .send({
        mediaId: 2,
        postId: 3,
        date: new Date()
    })
    .expect(404)
  })

  it("/publications POST with valid body should return 201", async () => {
    const media = await createMedia(prisma)
    const post = await createPost(prisma)


    await request(app.getHttpServer())
    .post("/publications")
    .send({
        mediaId: media.id,
        postId: post.id,
        date: new Date()
    })
    .expect(201)
  })

  it("/publications GET should return a empty array",async ()=>{
    const publications = await request(app.getHttpServer()).get("/publications");
    expect(publications.statusCode).toBe(200)
    expect(publications.body).toHaveLength(0);
  })

  it("/publications GET should return an array of objects",async ()=>{
    await createPublication(prisma, false);
    await createPublication(prisma, false)

    const publications = await request(app.getHttpServer()).get("/publications");
    expect(publications.statusCode).toBe(200)
    expect(publications.body).toHaveLength(2);
    expect(publications.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        mediaId: expect.any(Number),
        postId: expect.any(Number),
        date: expect.any(String)
      })
    ]))
  })

  it("/publications GET should return an array of objects that are published",async ()=>{
    await createPublication(prisma, false);
    await createPublication(prisma, true)

    const publications = await request(app.getHttpServer()).get("/publications?published=true");
    expect(publications.statusCode).toBe(200)
    expect(publications.body).toHaveLength(1);
    expect(publications.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        mediaId: expect.any(Number),
        postId: expect.any(Number),
        date: expect.any(String)
      })
    ]))
  })

  it("/publications/:id GET should return not found", async ()=>{

    const res = await request(app.getHttpServer()).get(`/publications/999`);
    console.log(res.body)
    expect(res.statusCode).toBe(404)

  } )

  it("/publications/:id GET should return specific record", async ()=>{
    const publication = await createPublication(prisma,false)

    const res = await request(app.getHttpServer()).get(`/publications/${publication.id}`);

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(expect.arrayContaining([{...publication, date: publication.date.toISOString()}]))

  } )

  it("/publications/:id PUT should return NOT FOUND when there is not a register", async ()=> {
    const res = await request(app.getHttpServer()).put(`/publications/99`).send({
        mediaId: 2,
        postId: 3,
        date: new Date()
    })
      expect(res.statusCode).toBe(404)

  })

  it("/publications/:id PUT should return NOT FOUND when there is not a media register", async ()=> {
    const publication = await createPublication(prisma,false)

    const res = await request(app.getHttpServer()).put(`/publications/${publication.id}`).send({
        mediaId: 2,
        postId: publication.postId,
        date: new Date()
    })
      expect(res.statusCode).toBe(404)

  })

  it("/publications/:id PUT should return FORBIDDEN when register is already published", async ()=> {
    const publication = await createPublication(prisma,true)

    const res = await request(app.getHttpServer()).put(`/publications/${publication.id}`).send({
        mediaId: publication.mediaId,
        postId: publication.postId,
        date: new Date()
    })
      expect(res.statusCode).toBe(403)

  })

  it("/publications/:id PUT should return OK", async ()=> {
    const publication = await createPublication(prisma, false)
    const post = await createPost(prisma)
    const media = await createMedia(prisma)

    const res = await request(app.getHttpServer()).put(`/publications/${publication.id}`).send({
        mediaId: media.id,
        postId: post.id,
        date: new Date()
    })

    expect(res.statusCode).toBe(200)

  })

  it("/posts/:id DELETE should return OK", async ()=>{
    const publication = await createPublication(prisma,false);

    const res = await request(app.getHttpServer()).delete(`/publications/${publication.id}`)

    expect(res.statusCode).toBe(200)
  })
});
