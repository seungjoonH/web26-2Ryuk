import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { RoomsModule } from '@src/modules/room/room.module';
import { AuthModule } from '@src/modules/auth/auth.module';

@Module({
  imports: [RoomsModule, AuthModule],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
