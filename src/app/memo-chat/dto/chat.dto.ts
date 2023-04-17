import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { GetMemoChat } from './get-memochat.dto';
import { PageMetaDto } from './page-meta.dto';

@ApiExtraModels(GetMemoChat)
export class ChatDto<T extends GetMemoChat> {
  @IsArray()
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [{ $ref: getSchemaPath(GetMemoChat) }],
    },
  })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
