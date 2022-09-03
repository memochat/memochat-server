import { Body, Controller, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { ApiErrorResponse } from '../../common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { Auth } from '../../common/decorators//auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MemoRoomService } from './memo-room.service';
import { CreateMemoRoomRequest } from './dto/create-memo-room-request.dto';
import { BadParameterException } from '../../common/exceptions/bad-parameter.exception';
import { ResponseEntity } from '../../common/response/response-entity';
import { MemoRoomId } from './dto/memo-room-id.dto';
import { RoomTypeNotFoundException } from '../../common/exceptions/room-type-not-found.exception';
import { TooManyMemoRoomsException } from '../../common/exceptions/too-many-memorooms.exception';

@Controller('/memo-rooms')
@ApiTags('MemoRoom')
export class MemoRoomController {
  constructor(private readonly memoRoomService: MemoRoomService) {}

  @Post('/')
  @Auth()
  @ApiSuccessResponse(HttpStatus.CREATED, MemoRoomId)
  @ApiErrorResponse(BadParameterException, RoomTypeNotFoundException, TooManyMemoRoomsException)
  async create(@CurrentUser() user: User, @Body() body: CreateMemoRoomRequest) {
    const memoRoom = await this.memoRoomService.create({ user, name: body.name, roomTypeId: body.roomTypeId });

    return ResponseEntity.OK_WITH_DATA(MemoRoomId.of(memoRoom));
  }
}
