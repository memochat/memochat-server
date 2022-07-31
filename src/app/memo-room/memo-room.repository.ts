import { Injectable } from '@nestjs/common';
import { MemoRoom } from './memo-room.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MemoRoomRepository extends Repository<MemoRoom> {
  constructor(private readonly dataSource: DataSource) {
    super(MemoRoom, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }
}
