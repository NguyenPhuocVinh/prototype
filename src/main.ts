import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSettings } from './configs/app.config';
import { LoggingInterceptor } from './cores/interceptors/logging.interceptor';
import { SystemErrorExceptionFilter } from './cores/errors/system-error-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import _ from 'lodash';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.setGlobalPrefix(`api`);

  await app.listen(appSettings.port, '0.0.0.0');
  if (_.isEqual(process.env.DEVELOPMENT, 'true')) {
    const config = new DocumentBuilder()
      .setTitle('MGE Document')
      .setVersion('2.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.useGlobalFilters(new SystemErrorExceptionFilter());
  console.log(await app.getUrl());

}
bootstrap();
