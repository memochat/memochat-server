import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MemoRoomService } from './memo-room.service';

@Controller('/memo-rooms')
@ApiTags('MemoRoom')
export class MemoRoomController {
  constructor(private readonly memoRoomService: MemoRoomService) {}
}
