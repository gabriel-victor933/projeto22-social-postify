import { NestFactory, HttpAdapterHost  } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const {httpAdapter} = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter,{
    P2003: HttpStatus.FORBIDDEN
  }))
  await app.listen(3000, () => console.log("running at port 3000!!"));
}
bootstrap();
