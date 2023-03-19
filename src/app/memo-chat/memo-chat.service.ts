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
import { MemoRoomNotMatchedException } from 'src/common/exceptions/memoroom-not-matched.exception';
import { MemoRoomService } from '../memo-room/memo-room.service';
import { GetAllMemoChatDto } from './dto/getAll-memochat.dto';
import { MemoChatNotFoundException } from 'src/common/exceptions/memochat-not-found.exception';
import { DeleteMemoChatDto } from './dto/delete-memochat.dto';

@Injectable()
export class MemoChatService {
  constructor(
    private readonly memoChatRepository: MemoChatRepository,
    private readonly memoRoomRepository: MemoRoomRepository,
    private readonly memoRoomService: MemoRoomService,
  ) {}

  async create({ user, roomId, body }: { user: User; roomId: number; body: CreateMemoChatDto }) {
    const existedMemoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({
      id: roomId,
    });
    if (!existedMemoRoom) {
      throw new MemoRoomNotFoundException();
    }

    if ((await existedMemoRoom.user).id !== user.id) {
      throw new MemoRoomNotMatchedException();
    }

    const memoChat = new MemoChat();
    switch (body.type) {
      case MemoChatCategory.TEXT.name:
        memoChat.type = MemoChatCategory.TEXT;
        break;

      case MemoChatCategory.LINK.name:
        memoChat.type = MemoChatCategory.LINK;
        const metadata = await this.getMetadata(body.link);
        memoChat.link = body.link;
        memoChat.title = metadata.title;
        memoChat.description = metadata.description;
        memoChat.thumbnail = metadata.image;
        break;

      default:
        break;
    }

    memoChat.message = body.message;
    memoChat.roomId = roomId;
    await this.memoChatRepository.save(memoChat);

    if (existedMemoRoom.previousRoomId !== null && existedMemoRoom.nextRoomId !== null) {
      await this.memoRoomService.updateOrder({
        user,
        roomId: existedMemoRoom.id,
        previousRoomId: existedMemoRoom.previousRoomId,
      });
    }
    return { ...memoChat, type: memoChat.type.name };
  }

  async gets({ user, roomId, getAllMemoChatDto }: { user: User; roomId: number; getAllMemoChatDto: GetAllMemoChatDto }) {
    const existedMemoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({
      id: roomId,
    });
    if (!existedMemoRoom) {
      throw new MemoRoomNotFoundException();
    }

    if ((await existedMemoRoom.user).id !== user.id) {
      throw new MemoRoomNotMatchedException();
    }

    const { limit, offset } = getAllMemoChatDto;

    const existedChats = await this.memoChatRepository.find({
      select: {
        id: true,
        createdAt: true,
        message: true,
        title: true,
        link: true,
        description: true,
        thumbnail: true,
        type: {
          enumName: true,
        },
      },
      where: { roomId },
      order: { createdAt: 'DESC' },
      cache: true,
      take: limit,
      skip: (offset - 1) * limit,
    });

    return existedChats.map((existedChat) => ({
      ...existedChat,
      type: existedChat.type.enumName,
    }));
  }

  async delete({ user, deleteMemoChatDto }: { user: User; deleteMemoChatDto: DeleteMemoChatDto }) {
    const { roomId, id } = deleteMemoChatDto;

    const existedMemoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({
      id: roomId,
    });
    if (!existedMemoRoom) {
      throw new MemoRoomNotFoundException();
    }

    if ((await existedMemoRoom.user).id !== user.id) {
      throw new MemoRoomNotMatchedException();
    }

    const willDeleteMemoChat = await this.memoChatRepository.findOneBy({ id });
    if (!willDeleteMemoChat) {
      throw new MemoChatNotFoundException();
    }

    if (willDeleteMemoChat.roomId !== existedMemoRoom.id) {
      throw new MemoRoomNotMatchedException(`해당 메모챗이 올바른 메모룸에 존재하지 않습니다.`);
    }

    return await this.memoChatRepository.softDelete({ id });
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
