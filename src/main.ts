import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MigrationService } from './migration/migration.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.RUN_MIGRATION === 'true') {
    const migrationService = app.get(MigrationService);
    await migrationService.runMigration();
    console.log('Data migrated successfully');
    await app.close();
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('Series API')
    .setDescription(
      'Complete API definition for Series API, using Rick and Morty API as data source',
    )
    .setVersion('0.2')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(3000);
}

bootstrap();
