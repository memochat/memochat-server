import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokensRequestDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1NzM5MDI4OCwiZXhwIjoxNjU5OTgyMjg4LCJ0eXBlIjoiUkVGUkVTSCJ9.NoVdIAjgHh9S6bsjFaa9q-kcJDNU0176TPFgkxc0PD4',
  })
  @IsString()
  refreshToken: string;
}
