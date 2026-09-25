import { Module } from '@nestjs/common';
import { FeedService } from './feed.service.js';
import { FeedController } from './feed.controller.js';

@Module({
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
