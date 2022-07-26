import { Injectable } from '@nestjs/common';
import { RoomCategoryNotFoundException } from '../../common/exceptions/room-type-not-found.exception';
import { MemoRoom } from './memo-room.entity';
import { User } from '../user/user.entity';
import { MemoRoomRepository } from './memo-room.repository';
import { RoomCategoryRepository } from './room-category.repository';
import { TooManyMemoRoomsException } from '../../common/exceptions/too-many-memorooms.exception';
import { MemoRoomNotFoundException } from '../../common/exceptions/memoroom-not-found.exception';

@Injectable()
export class MemoRoomService {
  constructor(
    private readonly memoRoomRepository: MemoRoomRepository,
    private readonly roomCategoryRepository: RoomCategoryRepository,
  ) {}

  async create({ user, name, roomCategoryId }: { user: User; name: string; roomCategoryId: number }) {
    const roomCategory = await this.roomCategoryRepository.findOneBy({ id: roomCategoryId });
    if (!roomCategory) {
      throw new RoomCategoryNotFoundException();
    }

    const roomCount = await this.memoRoomRepository.countByUserId(user.id);
    if (roomCount >= MemoRoom.MAX_ROOM_COUNT) {
      throw new TooManyMemoRoomsException(`최대 ${MemoRoom.MAX_ROOM_COUNT}개의 룸만 만들 수 있습니다.`);
    }

    const memoRoom = new MemoRoom();
    memoRoom.setUser(user);
    memoRoom.name = name;
    memoRoom.roomCategory = roomCategory;

    const firstRoom = await this.memoRoomRepository.findFirstRoomByUserId(user.id);

    if (!firstRoom) {
      return await this.memoRoomRepository.save(memoRoom);
    }

    memoRoom.nextRoom = firstRoom;
    firstRoom.previousRoom = memoRoom;

    await this.memoRoomRepository.save([memoRoom, firstRoom]);

    return memoRoom;
  }

  async update({
    user,
    memoRoomId,
    name,
    roomCategoryId,
  }: {
    user: User;
    memoRoomId: number;
    name: string;
    roomCategoryId: number;
  }) {
    const memoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({ user: { id: user.id }, id: memoRoomId });
    if (!memoRoom) {
      throw new MemoRoomNotFoundException();
    }

    const roomCategory = await this.roomCategoryRepository.findOneBy({ id: roomCategoryId });
    if (!roomCategory) {
      throw new RoomCategoryNotFoundException();
    }

    memoRoom.name = name;
    memoRoom.roomCategory = roomCategory;

    this.memoRoomRepository.save(memoRoom, { reload: false });
  }

  async gets({ user }: { user: User }) {
    const memoRooms = await this.memoRoomRepository.getAllMemoRoomsWithRecursiveByUserId(user.id);

    return memoRooms;
  }

  async get({ user, memoRoomId }: { user: User; memoRoomId: number }) {
    const memoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({ user: { id: user.id }, id: memoRoomId });
    if (!memoRoom) {
      throw new MemoRoomNotFoundException();
    }

    return memoRoom;
  }

  async getCategories() {
    return this.roomCategoryRepository.find();
  }

  async delete({ user, memoRoomId }: { user: User; memoRoomId: number }) {
    await this.memoRoomRepository.softDelete({ id: memoRoomId, user: { id: user.id } });
  }

  async updateOrder({
    user,
    memoRoomId,
    previousMemoRoomId,
  }: {
    user: User;
    memoRoomId: number;
    previousMemoRoomId: number;
  }) {
    const memoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({ user: { id: user.id }, id: memoRoomId });
    if (!memoRoom) {
      throw new MemoRoomNotFoundException();
    }

    if (memoRoom.previousRoomId === previousMemoRoomId) return;

    const previousMemoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({
      user: { id: user.id },
      id: previousMemoRoomId,
    });

    if (previousMemoRoomId > 0 && !previousMemoRoom) {
      throw new MemoRoomNotFoundException();
    }

    await this.memoRoomRepository.updateOrder({
      user,
      memoRoom,
      previousMemoRoom,
    });
  }
}
