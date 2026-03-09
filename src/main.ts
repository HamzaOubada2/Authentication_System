import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { LogginIntrceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Gobal prefix for all routes
  app.setGlobalPrefix('api');

  // Validation pipe for DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // GLOBAL INTERCEPTORS
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LogginIntrceptor(), // logs every request + time
    new ResponseInterceptor() // wraps every response
  )

  // GLOBAL EXCEPTION FILTER
  app.useGlobalFilters(new HttpExceptionFilter()); // handle All Errors
  await app.listen(3000);
  console.log(`Server running on http://localhost:3000/api`)
}
void bootstrap();

