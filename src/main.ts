import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  INestApplication,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import expressBasicAuth from 'express-basic-auth';
import { ErrorsInterceptor } from './common/interceptors/error.interceptor';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

const logger: Logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const configService = app.get<ConfigService>(ConfigService);
  const environment = configService.get('environment');
  const appPort = configService.get('app.port');
  const appHost = configService.get('app.host');
  const appVersion = configService.get('app.version');

  if (environment !== 'development') {
    const user = configService.get('swagger.user');
    app.use(
      ['/api', '/api-json'],
      expressBasicAuth({
        challenge: true,
        users: user,
      }),
    );
  }

  const initSwagger = (app: INestApplication, serverUrl: string) => {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('OnCulture')
      .setDescription('OnCulture API description')
      .setVersion(appVersion)
      .addBearerAuth()
      .addServer(serverUrl)
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  };

  initSwagger(app, appHost);

  const allowedOrigins = [
    /^(https:\/\/([^\.]*\.)?ngrok\.io)$/i,
    /^(http:\/\/([^\.]*\.)?localhost:3000)$/i,
    /^(https:\/\/([^\.]*\.)?dev\.onculture\.io)$/i,
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  const allowedOriginsProd = [
    'https://onculture.io',
    /^(https:\/\/([^\.]*\.)?onculture\.io)$/i,
  ];

  const origins =
    environment === 'production' ? allowedOriginsProd : allowedOrigins;

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  app.enableShutdownHooks();

  app.useGlobalInterceptors(
    new RequestInterceptor(),
    new ResponseInterceptor(),
    new ErrorsInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) =>
        new BadRequestException(
          validationErrors.reduce(
            (errorObj, validationList) => ({
              ...errorObj,
              [validationList.property]: validationList,
            }),
            {},
          ),
        ),
    }),
  );

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  await app.listen(appPort, () => {
    logger.log(`🚀 App is listening on ${appPort} 🚀`);
  });
}
bootstrap();
