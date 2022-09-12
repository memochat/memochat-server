import { Injectable } from '@nestjs/common';
import { MemoRoom } from './memo-room.entity';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, Repository, UpdateResult } from 'typeorm';
import { MemoRoomCategory } from 'src/app/memo-room/type/memo-room-category';

@Injectable()
export class MemoRoomRepository extends Repository<MemoRoom> {
  constructor(private readonly dataSource: DataSource) {
    super(MemoRoom, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }

  findFirstRoomByUserId(userId: number) {
    return this.findOneExludeDeletedRow({
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

  async softDelete(criteria: FindOptionsWhere<MemoRoom>): Promise<UpdateResult> {
    const memoRoom = await this.findOneBy(criteria);
    if (!memoRoom) return;

    await this.dataSource.transaction(async (em) => {
      if (memoRoom.nextRoomId) {
        await em.update(MemoRoom, { id: memoRoom.nextRoomId }, { previousRoomId: memoRoom.previousRoomId });
      }

      if (memoRoom.previousRoomId) {
        await em.update(MemoRoom, { id: memoRoom.previousRoomId }, { nextRoomId: memoRoom.nextRoomId });
      }

      memoRoom.remove();
      await em.save(memoRoom);
    });
  }

  async getAllMemoRoomsWithRecursiveByUserId(userId: number) {
    const results = await this.dataSource.query(
      `with recursive ordered_room (id) as (
        SELECT memo_room.id,0 as level, prev_room_id, next_room_id, created_at, updated_at, name, user_id, room_type_id, deleted_at
        FROM memo_room where deleted_at is null and user_id = $1 and prev_room_id IS null
        
        union
        
        SELECT m.id,ordered_room.level + 1 as level, m.prev_room_id, m.next_room_id, m.created_at, m.updated_at, m.name, m.user_id, m.room_type_id, m.deleted_at
        FROM memo_room m join ordered_room on (m.prev_room_id = ordered_room.id)  where m.deleted_at is null
      )
      
      select om.*, rt.category as room_type_category, rt.thumbnail as room_type_thumbnail from ordered_room om left join room_type rt on om.room_type_id = rt.id order by om.level;`,
      [userId],
    );

    return this.create(
      results.map((result) => ({
        id: result.id,
        name: result.name,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        roomType: {
          id: result.room_type_id,
          category: MemoRoomCategory.find(result.room_type_category),
          thumbnail: result.room_type_thumbnail,
        },
      })),
    );
  }
}
