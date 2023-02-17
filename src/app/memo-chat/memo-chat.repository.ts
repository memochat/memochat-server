import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MemoChat } from './memo-chat.entity';

@Injectable()
export class MemoChatRepository extends Repository<MemoChat> {
  constructor(private readonly dataSource: DataSource) {
    super(MemoChat, dataSource.createEntityManager(), dataSource.createQueryRunner());
  }
}
