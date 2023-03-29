import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { MemoChat } from '../memo-chat.entity';

export class GetMemoChat extends PickType(MemoChat, [
  'id',
  'updatedAt',
  'message',
  'link',
  'title',
  'description',
  'thumbnail',
] as const) {
  @ApiProperty({
    example: 'TEXT | LINK | PHOTO',
    description: '사용자가 텍스트 유형입니다. TEXT : link가 없는 일반 텍스트 \t LINK : link가 포함된 텍스트 \t PHOTO : 사진',
    required: true,
  })
  @IsNotEmpty()
  type: string;
}
