import { Module } from '@nestjs/common';
import { S3Module } from 'src/common/modules/s3/s3.module';
import { MemoRoomRepository } from '../memo-room/memo-room.repository';
import { MemoRoomService } from '../memo-room/memo-room.service';
import { RoomCategoryRepository } from '../memo-room/room-category.repository';
import { MemoChatController } from './memo-chat.controller';
import { MemoChatRepository } from './memo-chat.repository';
import { MemoChatService } from './memo-chat.service';

@Module({
  imports: [S3Module],
  controllers: [MemoChatController],
  providers: [MemoRoomRepository, RoomCategoryRepository, MemoChatRepository, MemoRoomService, MemoChatService],
})
export class MemoChatModule {}
