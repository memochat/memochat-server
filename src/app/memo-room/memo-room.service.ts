import { Injectable } from '@nestjs/common';
import { MemoRoomRepository } from './memo-room.repository';

@Injectable()
export class MemoRoomService {
  constructor(private readonly memoRoomRepository: MemoRoomRepository) {}
}
