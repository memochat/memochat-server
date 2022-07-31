import { Injectable } from '@nestjs/common';
import { MemoRoom } from '../memo-room/memo-room.entity';
import { User } from '../user/user.entity';
import { MemoRoomRepository } from './memo-room.repository';

@Injectable()
export class MemoRoomService {
  constructor(private readonly memoRoomRepository: MemoRoomRepository) {}

  async create(user: User, memoRoom: MemoRoom) {
    memoRoom.setUser(user);

    await this.memoRoomRepository.save(memoRoom);

    return memoRoom;
  }
}
