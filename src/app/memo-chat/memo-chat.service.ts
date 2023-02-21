import { Injectable } from '@nestjs/common';
import { MemoRoomNotFoundException } from 'src/common/exceptions/memoroom-not-found.exception';
import { MemoRoomRepository } from '../memo-room/memo-room.repository';
import { User } from '../user/user.entity';
import { CreateMemoChatDto } from './dto/create-memochat.dto';
import { MemoChatRepository } from './memo-chat.repository';
import { MemoChatCategory } from './type/memo-chat-category';
import got from 'got';
import metascraper from 'metascraper';
import title from 'metascraper-title';
import description from 'metascraper-description';
import image from 'metascraper-image';
import { MemoChat } from './memo-chat.entity';

@Injectable()
export class MemoChatService {
  constructor(
    private readonly memoChatRepository: MemoChatRepository,
    private readonly memoRoomRepository: MemoRoomRepository,
  ) {}

  async create({ user, roomId, body }: { user: User; roomId: number; body: CreateMemoChatDto }) {
    const existedMemoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({
      user: { id: user.id },
      id: roomId,
    });
    if (!existedMemoRoom) {
      throw new MemoRoomNotFoundException();
    }

    const memoChat = new MemoChat();
    switch (body.type) {
      case MemoChatCategory.TEXT.name:
        memoChat.type = MemoChatCategory.TEXT;
        break;

      case MemoChatCategory.LINK.name:
        memoChat.type = MemoChatCategory.LINK;
        const metadata = await this.getMetadata(body.link);
        memoChat.title = metadata.title;
        memoChat.description = metadata.description;
        memoChat.thumbnail = metadata.image;
        break;

      default:
        break;
    }

    memoChat.message = body.message;
    memoChat.memoRoomId = roomId;
    await this.memoChatRepository.save(memoChat);
    return memoChat;
  }

  async getMetadata(targetUrl: string) {
    const _metascraper = metascraper([title(), description(), image()]);
    try {
      const { body: html, url } = await got({ url: targetUrl });
      const metadata = await _metascraper({ html, url });

      console.log(metadata);

      return metadata;
    } catch (e) {
      console.log(e);
    }
  }
}