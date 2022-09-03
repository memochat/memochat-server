import { Injectable } from '@nestjs/common';
import { RoomTypeNotFoundException } from '../../common/exceptions/room-type-not-found.exception';
import { MemoRoom } from './memo-room.entity';
import { User } from '../user/user.entity';
import { MemoRoomRepository } from './memo-room.repository';
import { RoomTypeRepository } from './room-type.repository';
import { TooManyMemoRoomsException } from '../../common/exceptions/too-many-memorooms.exception';
import { MemoRoomNotFoundException } from '../../common/exceptions/memoroom-not-found.exception';

@Injectable()
export class MemoRoomService {
  constructor(
    private readonly memoRoomRepository: MemoRoomRepository,
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async create({ user, name, roomTypeId }: { user: User; name: string; roomTypeId: number }) {
    const roomType = await this.roomTypeRepository.findOneBy({ id: roomTypeId });
    if (!roomType) {
      throw new RoomTypeNotFoundException();
    }

    const roomCount = await this.memoRoomRepository.countBy({ user: { id: user.id } });
    if (roomCount >= MemoRoom.MAX_ROOM_COUNT) {
      throw new TooManyMemoRoomsException(`최대 ${MemoRoom.MAX_ROOM_COUNT}개의 룸만 만들 수 있습니다.`);
    }

    const memoRoom = new MemoRoom();
    memoRoom.setUser(user);
    memoRoom.name = name;
    memoRoom.roomType = roomType;

    await this.memoRoomRepository.save(memoRoom);

    return memoRoom;
  }

  async update({ memoRoomId, name, roomTypeId }: { memoRoomId: number; name: string; roomTypeId: number }) {
    const memoRoom = await this.memoRoomRepository.findOneBy({ id: memoRoomId });
    if (!memoRoom) {
      throw new MemoRoomNotFoundException();
    }

    const roomType = await this.roomTypeRepository.findOneBy({ id: roomTypeId });
    if (!roomType) {
      throw new RoomTypeNotFoundException();
    }

    memoRoom.name = name;
    memoRoom.roomType = roomType;

    this.memoRoomRepository.save(memoRoom, { reload: false });
  }

  async isMemoRoomOfUser(user: User, memoRoomId: number) {
    return !!(await this.memoRoomRepository.countBy({ user: { id: user.id }, id: memoRoomId }));
  }
}
