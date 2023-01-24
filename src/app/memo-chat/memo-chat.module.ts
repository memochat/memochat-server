import { Module } from '@nestjs/common';
import { MemoChatController } from './memo-chat.controller';
import { MemoChatService } from './memo-chat.service';

@Module({
  controllers: [MemoChatController],
  providers: [MemoChatService]
})
export class MemoChatModule {}
