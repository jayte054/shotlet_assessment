import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('shotlet assessment')
    .setDescription(' an api designed to fetch data from  another api')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key', // This should match the key your guard checks
        in: 'header',
      },
      'api-key', // This is the name used to reference this security definition
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('server.port', 3002);
  await app.listen(port);
  logger.log('application is running on port:', port);
}
bootstrap();
