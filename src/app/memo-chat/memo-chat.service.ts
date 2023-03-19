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

  async update({
    user,
    deleteMemoChatDto,
    createMemoChatDto,
  }: {
    user: User;
    deleteMemoChatDto: DeleteMemoChatDto;
    createMemoChatDto: CreateMemoChatDto;
  }) {
    const { id, roomId } = deleteMemoChatDto;
    const { type, message, link } = createMemoChatDto;

    const existedMemoRoom = await this.memoRoomRepository.findOneExludeDeletedRowBy({
      id: roomId,
    });
    if (!existedMemoRoom) {
      throw new MemoRoomNotFoundException();
    }

    if ((await existedMemoRoom.user).id !== user.id) {
      throw new MemoRoomNotMatchedException();
    }

    const willUpdateMemoChat = await this.memoChatRepository.findOneBy({ id });
    if (!willUpdateMemoChat) {
      throw new MemoChatNotFoundException();
    }

    if (willUpdateMemoChat.roomId !== existedMemoRoom.id) {
      throw new MemoRoomNotMatchedException(`해당 메모챗이 올바른 메모룸에 존재하지 않습니다.`);
    }

    switch (type) {
      case MemoChatCategory.LINK.name:
        willUpdateMemoChat.type = MemoChatCategory.LINK;
        const metadata = await this.getMetadata(link);
        willUpdateMemoChat.link = link;
        willUpdateMemoChat.title = metadata.title;
        willUpdateMemoChat.description = metadata.description;
        willUpdateMemoChat.thumbnail = metadata.image;
        break;

      case MemoChatCategory.TEXT.name:
        willUpdateMemoChat.type = MemoChatCategory.TEXT;
        willUpdateMemoChat.link = null;
        willUpdateMemoChat.title = null;
        willUpdateMemoChat.description = null;
        willUpdateMemoChat.thumbnail = null;
        break;

      default:
        break;
    }

    willUpdateMemoChat.message = message;
    await this.memoChatRepository.save(willUpdateMemoChat);

    return { ...willUpdateMemoChat, type: willUpdateMemoChat.type.name };
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
