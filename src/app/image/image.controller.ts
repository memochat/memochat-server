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
  @ApiSuccessResponse(HttpStatus.OK, PresignedUrlResponseDto)
  async getPresignedURL(@Body() body: UploadPresignedUrlRequestDto) {
    const { imageKey, presignedUrl } = await this.imageService.uploadPresignedUrl(body.toEntity().type);

    return ResponseEntity.OK_WITH_DATA(new PresignedUrlResponseDto({ key: imageKey, url: presignedUrl }));
  }
}
