import { Module, Global } from '@nestjs/common';
import { redisProvider } from './redis.provider';

@Global() // 전역 모듈로 설정하여 어디서든 사용 가능
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
