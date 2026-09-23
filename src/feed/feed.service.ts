import { Injectable } from '@nestjs/common';

const initFeedData = [
  {
    id: 1,
    userId: 1,
    content: '첫 번째 피드입니다.',
    createdAt: '2026-09-24T00:00:00.000Z',
  },
  {
    id: 2,
    userId: 2,
    content: 'Nest.js로 만든 Feed API 테스트 중!',
    createdAt: '2026-09-24T01:00:00.000Z',
  },
];

@Injectable()
export class FeedService {
  getFeeds() {
    return initFeedData;
  }
}
