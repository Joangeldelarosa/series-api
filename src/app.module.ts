import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SerieModule } from './serie/serie.module';

@Module({
  imports: [AuthModule, SerieModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
