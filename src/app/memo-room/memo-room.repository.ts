import { Injectable } from '@nestjs/common';
import { MemoRoom } from './memo-room.entity';
import { DataSource, IsNull, Repository } from 'typeorm';

@Injectable()
export class MemoRoomRepository extends Repository<MemoRoom> {
  constructor(private readonly dataSource: DataSource) {
    super(MemoRoom, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  findFirstRoomByUserId(userId: number) {
    return this.findOne({
      where: { user: { id: userId }, previousRoomId: IsNull() },
      relations: { nextRoom: true },
    });
  }
}
