import { NestFactory, HttpAdapterHost  } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config()
  
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const {httpAdapter} = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter,{
    P2003: HttpStatus.FORBIDDEN,
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  }))
  await app.listen(3000, () => console.log("running at port 3000!!"));
}
bootstrap();
