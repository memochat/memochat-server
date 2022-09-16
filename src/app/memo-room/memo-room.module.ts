import { Module } from '@nestjs/common';
import { MemoRoomController } from './memo-room.controller';
import { MemoRoomService } from './memo-room.service';
import { MemoRoomRepository } from './memo-room.repository';
import { RoomTypeRepository } from './room-type.repository';
import { S3Module } from 'src/common/modules/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [MemoRoomController],
  providers: [MemoRoomRepository, RoomTypeRepository, MemoRoomService],
})
export class MemoRoomModule {}
