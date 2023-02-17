import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { BadParameterException } from 'src/common/exceptions/bad-parameter.exception';
import { S3Service } from 'src/common/modules/s3/s3.service';
import { ResponseEntity } from 'src/common/response/response-entity';
import { MemoRoomId } from '../memo-room/dto/memo-room-id.dto';
import { User } from '../user/user.entity';
import { CreateMemoChatDto } from './dto/create-memochat.dto';
import { MemoChatService } from './memo-chat.service';

@Controller('/memo-chats')
@ApiTags('MemoChat')
export class MemoChatController {
  constructor(private readonly memoChatService: MemoChatService, private readonly s3Service: S3Service) {}

  @Post('/')
  @Auth()
  @ApiSuccessResponse(HttpStatus.CREATED, MemoRoomId)
  @ApiErrorResponse(BadParameterException)
  async create(@CurrentUser() user: User, @Body() body: CreateMemoChatDto) {
    const memoChat = await this.memoChatService.create({ user, body });

    return ResponseEntity.OK_WITH_DATA(memoChat);
  }

  // metaData TEST URL
  // @Post('/metadata')
  // @Auth()
  // async getMetadata(@Body() body) {
  //   const metaData = await this.memoChatService.getMetadata(body);

  //   return ResponseEntity.OK_WITH_DATA(metaData);
  // }
}
