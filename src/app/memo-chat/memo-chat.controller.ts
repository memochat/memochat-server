import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { Get, Param, Query, Delete, Patch } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { BadParameterException } from 'src/common/exceptions/bad-parameter.exception';
import { MemoChatNotFoundException } from 'src/common/exceptions/memochat-not-found.exception';
import { MemoRoomNotFoundException } from 'src/common/exceptions/memoroom-not-found.exception';
import { S3Service } from 'src/common/modules/s3/s3.service';
import { ResponseEntity } from 'src/common/response/response-entity';
import { User } from '../user/user.entity';
import { ChatDto } from './dto/chat.dto';
import { CreateMemoChatDto } from './dto/create-memochat.dto';
import { DeleteMemoChatDto } from './dto/delete-memochat.dto';
import { GetMemoChat } from './dto/get-memochat.dto';
import { PageMetaDto } from './dto/page-meta.dto';
import { PageOptionsDto } from './dto/page-option.dto';
import { MemoChat } from './memo-chat.entity';
import { MemoChatService } from './memo-chat.service';

@Controller('/rooms')
@ApiTags('MemoChat')
export class MemoChatController {
  constructor(private readonly memoChatService: MemoChatService, private readonly s3Service: S3Service) {}

  @Post('/:roomId/chats')
  @ApiOperation({ summary: '메모챗 생성 API', description: '메모챗(TEXT|LINK|PHOTO)을 생성합니다.' })
  @Auth()
  @ApiSuccessResponse(HttpStatus.CREATED, MemoChat)
  @ApiErrorResponse(BadParameterException, MemoRoomNotFoundException)
  async create(@CurrentUser() user: User, @Param('roomId', ParseIntPipe) roomId: number, @Body() body: CreateMemoChatDto) {
    const memoChat = await this.memoChatService.create({ user, roomId, body });

    return ResponseEntity.OK_WITH_DATA(memoChat);
  }

  @Get('/:roomId/chats')
  @ApiOperation({ summary: '메모룸 내 전체 Chat 조회 API', description: ':roomId에 관한 전체 Chat을 조회합니다.' })
  @Auth()
  @ApiSuccessResponse(HttpStatus.OK, ChatDto<GetMemoChat>)
  @ApiErrorResponse(BadParameterException, MemoRoomNotFoundException)
  async gets(
    @CurrentUser() user: User,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    const existedMemoChats = await this.memoChatService.gets({ user, roomId, pageOptionsDto });
    return ResponseEntity.OK_WITH_DATA(existedMemoChats);
  }

  @Patch('/:roomId/chats/:id')
  @ApiOperation({ summary: '메모챗 수정 API', description: ': 해당하는 메모룸 내에 있는 메모챗을 수정합니다.' })
  @Auth()
  @ApiSuccessResponse(HttpStatus.OK, MemoChat)
  @ApiErrorResponse(BadParameterException, MemoRoomNotFoundException, MemoChatNotFoundException)
  async update(
    @CurrentUser() user: User,
    @Param() deleteMemoChatDto: DeleteMemoChatDto,
    @Body() createMemoChatDto: CreateMemoChatDto,
  ) {
    const updatedMemoChat = await this.memoChatService.update({ user, deleteMemoChatDto, createMemoChatDto });
    return ResponseEntity.OK_WITH_DATA(updatedMemoChat);
  }

  @Delete('/:roomId/chats/:id')
  @ApiOperation({ summary: '메모챗 삭제 API', description: ': 해당하는 메모룸 내에 있는 메모챗을 삭제합니다.' })
  @Auth()
  @ApiSuccessResponse(HttpStatus.OK)
  @ApiErrorResponse(BadParameterException, MemoRoomNotFoundException, MemoChatNotFoundException)
  async delete(@CurrentUser() user: User, @Param() deleteMemoChatDto: DeleteMemoChatDto) {
    const deletedMemoChat = await this.memoChatService.delete({ user, deleteMemoChatDto });
    return ResponseEntity.OK();
  }
}
