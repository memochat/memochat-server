import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { BadParameterException } from 'src/common/exceptions/bad-parameter.exception';
import { MemoRoomNotFoundException } from 'src/common/exceptions/memoroom-not-found.exception';
import { S3Service } from 'src/common/modules/s3/s3.service';
import { ResponseEntity } from 'src/common/response/response-entity';
import { User } from '../user/user.entity';
import { CreateMemoChatDto } from './dto/create-memochat.dto';
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

  /*
  POST rooms/:id/chats
  PUT rooms/:id/chats/:id
  DELETE rooms/:id/chats/:chat_id

  메모챗 조회, 수정, 삭제
  */
}
