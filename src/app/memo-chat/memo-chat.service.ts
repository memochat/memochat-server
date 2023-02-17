import { Injectable } from '@nestjs/common';
import { MemoRoomNotFoundException } from 'src/common/exceptions/memoroom-not-found.exception';
import { MemoRoomRepository } from '../memo-room/memo-room.repository';
import { User } from '../user/user.entity';
import { CreateMemoChatDto } from './dto/create-memochat.dto';
import { MemoChatRepository } from './memo-chat.repository';
import got from 'got';
import metascraper from 'metascraper';
import title from 'metascraper-title';
import description from 'metascraper-description';
import image from 'metascraper-image';

@Injectable()
export class MemoChatService {
  constructor(
    private readonly memoChatRepository: MemoChatRepository,
    private readonly memoRoomRepository: MemoRoomRepository,
  ) {}

  async create({ user, body }: { user: User; body: CreateMemoChatDto }) {
    // 1번 방 기준으로
    /*
    1. 1번 방이 내 방인지 확인?
    2. 내 방일 때만 채팅 생성이 가능하게 하고
    3. TYPE을 확인하고 TEXT / LINK인지 확인하고 ( 추후 PHOTO까지 여기서?)
    4-1. TEXT일 경우
          => LINK 자체를 확인할 필요가 없이 바로 채팅 저장 및 Return
    4-2. LINK일 경우
          => LINK 확인하고 metadata 생성하고 metadata와 함께 저장하고 Return
    */

    // 1. 1번 방이 내 방인지 확인?
    console.log(`user : ${user} \n body : ${body}`);

    const existedMemoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({
      user: { id: user.id },
      id: body.roomId,
    });
    if (!existedMemoRoom) {
      throw new MemoRoomNotFoundException();
    }
  }

  async getMetadata(body) {
    const _metascraper = metascraper([title(), description(), image()]);
    try {
      const targetUrl = body?.url;
      const { body: html, url } = await got({ url: targetUrl });
      const metadata = await _metascraper({ html, url });

      console.log(metadata);

      return metadata;
    } catch (e) {
      console.log(e);
    }
  }
}
