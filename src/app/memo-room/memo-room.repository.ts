import { Injectable } from '@nestjs/common';
import { MemoRoom } from './memo-room.entity';
import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, IsNull, Repository, UpdateResult } from 'typeorm';
import { MemoRoomCategory } from './type/memo-room-category';
import { User } from '../user/user.entity';

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
      `SELECT 
          mr.id,
          mr.created_at,
          mc.updated_at,
          mr.name,
          rt.id AS room_category_id,
          rt.name AS room_category_name,
          rt.thumbnail AS room_category_thumbnail,
          mc.message,
          mr.prev_room_id,
          mr.next_room_id
      FROM
          memo_room mr
              LEFT JOIN
          room_category rt ON rt.id = mr.room_category_id,
          memo_chat mc
      WHERE
          mr.id = mc.room_id AND mr.user_id = ${userId}
              AND mr.deleted_at IS NULL
              AND mc.updated_at IN (SELECT 
                  MAX(updated_at)
              FROM
                  memo_chat
              WHERE
                  deleted_at IS NULL
              GROUP BY room_id)
      ORDER BY mc.updated_at DESC;`,
      [userId],
    );

    return this.create(
      results.map((result) => ({
        id: result.id,
        name: result.name,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
        message: result.message ?? '사진',
        roomCategory: {
          id: result.room_category_id,
          name: MemoRoomCategory.find(result.room_category_name),
          thumbnail: result.room_category_thumbnail,
        },
        previousRoomId: result.prev_room_id,
        nextRoomId: result.next_room_id,
      })),
    );
  }

  async updateOrder({
    user,
    memoRoom,
    previousMemoRoom,
  }: {
    user: User;
    memoRoom: MemoRoom;
    previousMemoRoom: MemoRoom | null;
  }) {
    await this.dataSource.transaction(async (em) => {
      if (memoRoom.previousRoomId) {
        await em.update(MemoRoom, { id: memoRoom.previousRoomId }, { nextRoomId: memoRoom.nextRoomId });
      }

      if (memoRoom.nextRoomId) {
        await em.update(MemoRoom, { id: memoRoom.nextRoomId }, { previousRoomId: memoRoom.previousRoomId });
      }

      if (!previousMemoRoom) {
        const firstRoom = await em.findOneBy(MemoRoom, {
          user: { id: user.id },
          previousRoomId: IsNull(),
          deletedAt: IsNull(),
        });

        await em.update(MemoRoom, { id: memoRoom.id }, { nextRoomId: firstRoom.id, previousRoomId: null });
        await em.update(MemoRoom, { id: firstRoom.id }, { previousRoomId: memoRoom.id });
        return;
      }

      await em.update(
        MemoRoom,
        { id: memoRoom.id },
        { previousRoomId: previousMemoRoom.id, nextRoomId: previousMemoRoom.nextRoomId },
      );
      await em.update(MemoRoom, { id: previousMemoRoom.id }, { nextRoomId: memoRoom.id });
      await em.update(MemoRoom, { id: previousMemoRoom.nextRoomId }, { previousRoomId: memoRoom.id });
    });
  }
}
