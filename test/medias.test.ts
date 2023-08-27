import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus,    } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { createMedia } from './factories/medias.factories';
import { HttpAdapterHost  } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { createPublication } from './factories/publications.factories';


describe('"/medias" integration test', () => {
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

  it("/medias POST with invalid body should return 400", async () => {
    await request(app.getHttpServer())
    .post("/medias")
    .send({})
    .expect(400)
  })

  it("/medias POST with valid body should return 201", async () => {
    await request(app.getHttpServer())
    .post("/medias")
    .send({
        title: "Instagram",
        username: "Gabriel"
    })
    .expect(201)
  })

  it("/medias GET should return a empty array",async ()=>{
    const medias = await request(app.getHttpServer()).get("/medias");
    expect(medias.statusCode).toBe(200)
    expect(medias.body).toHaveLength(0);
  })

  it("/medias GET should return an array of objects",async ()=>{
    await createMedia(prisma);
    await createMedia(prisma);

    const medias = await request(app.getHttpServer()).get("/medias");
    expect(medias.statusCode).toBe(200)
    expect(medias.body).toHaveLength(2);
    expect(medias.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        username: expect.any(String)
      })
    ]))
  })

  it("/medias/:id GET should return not found", async ()=>{

    const res = await request(app.getHttpServer()).get(`/medias/99`);

    expect(res.statusCode).toBe(404)

  } )

  it("/medias/:id GET should return specific record", async ()=>{
    const media = await createMedia(prisma)

    const res = await request(app.getHttpServer()).get(`/medias/${media.id}`);

    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual(expect.arrayContaining([media]))

  } )

  it("/medias/:id PUT should return CONFLICT when edition has the same combination that one record have", async ()=> {
    const media = await createMedia(prisma)
    const media2 = await createMedia(prisma)

    const res = await request(app.getHttpServer()).put(`/medias/${media.id}`).send({
      title: media2.title,
      username: media2.username
    })

    expect(res.statusCode).toBe(409)

  })

  it("/medias/:id PUT should return OK", async ()=> {
    const media = await createMedia(prisma)

    const res = await request(app.getHttpServer()).put(`/medias/${media.id}`).send({
      title: "new title",
      username: "new username"
    })

    expect(res.statusCode).toBe(200)

  })

  it("/medias/:id DELETE ot should return FORBIDDEN",async ()=>{
    const publication = await createPublication(prisma, false)

    const res = await  request(app.getHttpServer()).delete(`/medias/${publication.mediaId}`)
    expect(res.statusCode).toBe(403)
  })

  it("/medias/:id DELETE should return OK", async ()=>{
    const media = await createMedia(prisma);

    const res = await request(app.getHttpServer()).delete(`/medias/${media.id}`)

    expect(res.statusCode).toBe(200)
  })
});
