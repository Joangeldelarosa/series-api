import { Module } from '@nestjs/common';
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
  // controllers: [AppController],
  // providers: [AppService],
  // We can implement later the app controller and service for the root module
  // To serve general information about the API
})
export class AppModule {}
