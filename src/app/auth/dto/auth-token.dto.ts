import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1NzM5MDI4OCwiZXhwIjoxNjU3MzkyMDg4LCJ0eXBlIjoiQUNDRVNTIn0.3LaWE-f8vy7DX8e_uLvipn0eDRVUyw5FDMspnSmN3Wk',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1NzM5MDI4OCwiZXhwIjoxNjU5OTgyMjg4LCJ0eXBlIjoiUkVGUkVTSCJ9.NoVdIAjgHh9S6bsjFaa9q-kcJDNU0176TPFgkxc0PD4',
  })
  refreshToken: string;

  @ApiProperty({ example: 1 })
  userId: number;

  static of({ accessToken, refreshToken, userId }: { accessToken: string; refreshToken: string; userId: number }) {
    const authTokenDto = new AuthTokenDto();
    authTokenDto.accessToken = accessToken;
    authTokenDto.refreshToken = refreshToken;
    authTokenDto.userId = userId;
    return authTokenDto;
  }
}
