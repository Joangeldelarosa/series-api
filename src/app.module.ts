import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SeriesModule } from './series/series.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationModule } from './migration/migration.module';

@Module({
  imports: [
    AuthModule,
    SeriesModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MigrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
