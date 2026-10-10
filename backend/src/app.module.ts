import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [SessionModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
