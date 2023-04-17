import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { Auth } from '../../common/decorators/auth.decorator';
import { ResponseEntity } from '../../common/response/response-entity';
import { ImageService } from './image.service';
import { PresignedUrlResponseDto } from './type/presigned-url-response.dto';
import { UploadPresignedUrlRequestDto } from './type/upload-presigned-url-request.dto';

@Controller('/images')
@ApiTags('Images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/presigned')
  @Auth()
  @ApiSuccessResponse(HttpStatus.OK, PresignedUrlResponseDto, { isArray: true })
  uploadPresignedUrl(@Body() body: UploadPresignedUrlRequestDto) {
    const results = this.imageService.uploadPresignedUrl(body.toEntity());

    return ResponseEntity.OK_WITH_DATA(
      results.map(({ key, presignedUrl }) => new PresignedUrlResponseDto({ key, url: presignedUrl })),
    );
  }

  /*
  image create => 복수 이미지 업로드 가능
  delete => 우선 한 개만 삭제
  Read  => 사진 전체 모아보기
        => Union / Join으로 해서 메모챗 전체 조회 가져오기
  */
}
