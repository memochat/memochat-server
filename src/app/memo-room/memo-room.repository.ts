import { Injectable } from '@nestjs/common';
import { MemoRoom } from './memo-room.entity';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, Repository } from 'typeorm';

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

  countByUserId(userId: number) {
    return this.countBy({ user: { id: userId }, deletedAt: IsNull() });
  }

  findOneExludeDeletedRow(options: FindOneOptions<MemoRoom>): Promise<MemoRoom> {
    return this.findOne({ ...options, where: { ...options.where, deletedAt: IsNull() } });
  }

  findOneExludeDeletedRowBy(where: FindOptionsWhere<MemoRoom> | FindOptionsWhere<MemoRoom>[]): Promise<MemoRoom> {
    return this.findOneBy({ ...where, deletedAt: IsNull() });
  }

  findExcludeDeletedRows(options: FindManyOptions<MemoRoom> = {}): Promise<MemoRoom[]> {
    return this.find({ ...options, where: { ...options.where, deletedAt: IsNull() } });
  }
}
