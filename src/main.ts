import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { AllCatchExceptionFilter } from './base/filter/all-catch-exception.filter';
import { ConfigService } from '@nestjs/config';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule, {
    abortOnError: true,
    bufferLogs: true,
  });

  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  const exceptionFilter = new AllCatchExceptionFilter(
    app.get(HttpAdapterHost),
    logger,
  );
  const pipes = new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(exceptionFilter);
  app.useGlobalPipes(pipes);

  await app.listen(3000);
  logger.log(
    `current environment: ${config.get('common.nodeEnv')}`,
    `Bootstrap`,
  );
}

bootstrap().catch((error) => console.error(error));
