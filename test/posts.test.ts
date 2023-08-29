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


describe('"/posts" integration test', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService()

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).overrideProvider(PrismaService)
        .useValue(prisma)
        .compile();

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

    afterAll(async () => {
      await prisma.$disconnect()
    })

  it("/posts POST with invalid body should return 400", async () => {
    await request(app.getHttpServer())
    .post("/posts")
    .send({})
    .expect(400)
  })

  it("/posts POST with valid body should return 201", async () => {
    await request(app.getHttpServer())
    .post("/posts")
    .send({
        title: "titulo",
        text: "texto texto"
    })
    .expect(201)
  })

  it("/posts GET should return a empty array",async ()=>{
    const posts = await request(app.getHttpServer()).get("/posts");
    expect(posts.statusCode).toBe(200)
    expect(posts.body).toHaveLength(0);
  })

  it("/posts GET should return an array of objects",async ()=>{
    await createPost(prisma);
    await createPost(prisma);

    const posts = await request(app.getHttpServer()).get("/posts");
    expect(posts.statusCode).toBe(200)
    expect(posts.body).toHaveLength(2);
    expect(posts.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        text: expect.any(String),
      })
    ]))
  })

  it("/posts/:id GET should return not found", async ()=>{

    const res = await request(app.getHttpServer()).get(`/posts/99`);

    expect(res.statusCode).toBe(404)

  } )

  it("/posts/:id GET should return specific record", async ()=>{
    const post = await createPost(prisma)

    const res = await request(app.getHttpServer()).get(`/posts/${post.id}`);

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(expect.arrayContaining([post]))

  } )

  it("/posts/:id PUT should return NOT FOUND", async ()=> {
    const res = await request(app.getHttpServer()).put(`/posts/99`).send({
        title: "new title",
        text: "new username"
      })
  
      expect(res.statusCode).toBe(404)

  })

  it("/posts/:id PUT should return OK", async ()=> {
    const post = await createPost(prisma)

    const res = await request(app.getHttpServer()).put(`/posts/${post.id}`).send({
      title: "new title",
      text: "new username"
    })

    expect(res.statusCode).toBe(200)

  })

  it("/posts/:id DELETE ot should return FORBIDDEN",async ()=>{
    const publication = await createPublication(prisma, false)

    const res = await  request(app.getHttpServer()).delete(`/posts/${publication.postId}`)
    expect(res.statusCode).toBe(403)
  })

  it("/posts/:id DELETE should return OK", async ()=>{
    const post = await createPost(prisma);

    const res = await request(app.getHttpServer()).delete(`/posts/${post.id}`)

    expect(res.statusCode).toBe(200)
  })
});
