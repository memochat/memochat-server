import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomType } from './room-type.entity';

@Injectable()
export class RoomTypeRepository extends Repository<RoomType> {
  constructor(private readonly dataSource: DataSource) {
    super(RoomType, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }
}
