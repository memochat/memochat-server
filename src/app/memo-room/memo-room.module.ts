import { Module } from '@nestjs/common';
import { MemoRoomController } from './memo-room.controller';
import { MemoRoomService } from './memo-room.service';
import { MemoRoomRepository } from './memo-room.repository';

@Module({
  controllers: [MemoRoomController],
  providers: [MemoRoomRepository, MemoRoomService],
})
export class MemoRoomModule {}
