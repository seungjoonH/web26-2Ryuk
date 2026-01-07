import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MockAuthService } from './mock-auth.service';

@Module({
  controllers: [AuthController],
  providers: [MockAuthService],
  exports: [MockAuthService],
})
export class AuthModule {}
