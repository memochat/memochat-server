import { Module } from '@nestjs/common';
import { MemoRoomController } from './memo-room.controller';
import { MemoRoomService } from './memo-room.service';
import { MemoRoomRepository } from './memo-room.repository';
import { RoomCategoryRepository } from './room-category.repository';
import { S3Module } from '../../common/modules/s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [MemoRoomController],
  providers: [MemoRoomRepository, RoomCategoryRepository, MemoRoomService],
})
export class MemoRoomModule {}
