import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoomCategory } from './room-category.entity';

@Injectable()
export class RoomCategoryRepository extends Repository<RoomCategory> {
  constructor(private readonly dataSource: DataSource) {
    super(RoomCategory, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }
}
