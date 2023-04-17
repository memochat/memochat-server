import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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
import { RoomCategoryNotFoundException } from '../../common/exceptions/room-type-not-found.exception';
import { TooManyMemoRoomsException } from '../../common/exceptions/too-many-memorooms.exception';
import { UpdateMemoRoomRequest } from './dto/update-memo-room-request.dto';
import { MemoRoomNotFoundException } from '../../common/exceptions/memoroom-not-found.exception';
import { MemoRoomDto } from './dto/memo-room.dto';
import { RoomCategoryDto } from './dto/room-type.dto';
import { UpdateMemoRoomOrederRequest } from '../../app/memo-room/dto/update-memo-room-order-request.dto';
import { S3Service } from '../../common/modules/s3/s3.service';

@Controller('/rooms')
@ApiTags('MemoRoom')
export class MemoRoomController {
  constructor(private readonly memoRoomService: MemoRoomService, private readonly s3Service: S3Service) {}

  @Post('/')
  @Auth()
  @ApiSuccessResponse(HttpStatus.CREATED, MemoRoomId)
  @ApiErrorResponse(BadParameterException, RoomCategoryNotFoundException, TooManyMemoRoomsException)
  async create(@CurrentUser() user: User, @Body() body: CreateMemoRoomRequest) {
    const memoRoom = await this.memoRoomService.create({ user, name: body.name, roomCategoryId: body.roomCategoryId });

    return ResponseEntity.OK_WITH_DATA(MemoRoomId.of(memoRoom));
  }

  @Put('/:id')
  @Auth()
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  @ApiErrorResponse(BadParameterException, RoomCategoryNotFoundException, MemoRoomNotFoundException)
  async update(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number, @Body() body: UpdateMemoRoomRequest) {
    await this.memoRoomService.update({ user, id, name: body.name, roomCategoryId: body.roomCategoryId });
  }

  @Get('/categories')
  @Auth()
  @ApiSuccessResponse(HttpStatus.OK, RoomCategoryDto, { isArray: true })
  async getCategories() {
    const categories = await this.memoRoomService.getCategories();

    return ResponseEntity.OK_WITH_DATA(
      categories.map((category) => {
        category.thumbnail = `https://memochat-public.s3.ap-northeast-2.amazonaws.com/${category.thumbnail}`;
        return RoomCategoryDto.of(category);
      }),
    );
  }

  @Get('/')
  @Auth()
  @ApiSuccessResponse(HttpStatus.OK, MemoRoomDto, { isArray: true })
  async gets(@CurrentUser() user: User) {
    const memoRooms = await this.memoRoomService.gets({ user });

    return ResponseEntity.OK_WITH_DATA(
      memoRooms.map((memoRoom) => {
        // memoRoom.roomCategory.thumbnail = this.s3Service.presignForGet(memoRoom.roomCategory.thumbnail);
        memoRoom.roomCategory.thumbnail = `https://memochat-public.s3.ap-northeast-2.amazonaws.com/${memoRoom.roomCategory.thumbnail}`;
        return MemoRoomDto.of(memoRoom);
      }),
    );
  }

  @Get('/:id')
  @Auth()
  @ApiSuccessResponse(HttpStatus.OK, MemoRoomDto, { isArray: true })
  @ApiErrorResponse(MemoRoomNotFoundException)
  async get(@CurrentUser() user: User, @Param('id', ParseIntPipe) roomId: number) {
    const memoRoom = await this.memoRoomService.get({ user, roomId });

    // memoRoom.roomCategory.thumbnail = this.s3Service.presignForGet(memoRoom.roomCategory.thumbnail);
    memoRoom.roomCategory.thumbnail = `https://memochat-public.s3.ap-northeast-2.amazonaws.com/${memoRoom.roomCategory.thumbnail}`;

    return ResponseEntity.OK_WITH_DATA(MemoRoomDto.of(memoRoom));
  }

  @Put('/:id/order')
  @Auth()
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  @ApiErrorResponse(MemoRoomNotFoundException)
  async updateOrder(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) roomId: number,
    @Body() body: UpdateMemoRoomOrederRequest,
  ) {
    await this.memoRoomService.updateOrder({ user, roomId, previousRoomId: body.previousRoomId, message: body.message });
  }

  @Delete('/:id')
  @Auth()
  @ApiSuccessResponse(HttpStatus.NO_CONTENT)
  async delete(@CurrentUser() user: User, @Param('id', ParseIntPipe) roomId: number) {
    await this.memoRoomService.delete({ user, roomId });
  }
}
