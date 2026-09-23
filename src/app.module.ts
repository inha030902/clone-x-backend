import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { FeedModule } from './feed/feed.module.js';

@Module({
  imports: [UserModule, FeedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
