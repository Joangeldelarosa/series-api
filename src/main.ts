import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MigrationService } from './migration/migration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.RUN_MIGRATION === 'true') {
    const migrationService = app.get(MigrationService);
    await migrationService.runMigration();
    console.log('Data migrated successfully');
    await app.close();
    return;
  }

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
