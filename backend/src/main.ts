import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CorsConfig, SwaggerConfig } from './common/configs/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Database

  const configService = app.get(ConfigService);
  const port = configService.get<EnvironmentVariables>('PORT', { infer: true });
  const corsConfig = configService.get<CorsConfig>('cors', { infer: true });

  // Documentation
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');
  if (swaggerConfig?.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version || '1.0')
      .addBasicAuth()
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path, app, document);
  }

  // Cors
  if (corsConfig?.enabled) {
    app.enableCors({
      origin: [
        'http://localhost:3000',
        //`${EnvVariableHelper.VARIABLES.FRONTEND_PROTOCOL}://${EnvVariableHelper.VARIABLES.FRONTEND_HOST}`,
        //`${EnvVariableHelper.VARIABLES.FRONTEND_PROTOCOL}://www.${EnvVariableHelper.VARIABLES.FRONTEND_HOST}`,
      ],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
      maxAge: 600,
    });
  }
  console.log(`Is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
