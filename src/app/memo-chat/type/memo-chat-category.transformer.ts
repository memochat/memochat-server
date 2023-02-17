import { MemoChatCategory } from './memo-chat-category';
import { ValueTransformer } from 'typeorm';

export class MemoChatCategoryTransformer implements ValueTransformer {
  to(entityValue: MemoChatCategory): string {
    if (!(entityValue instanceof MemoChatCategory)) return null;

    return entityValue.name;
  }

  from(databaseValue: string): MemoChatCategory {
    if (!databaseValue) return null;

    return MemoChatCategory.find(databaseValue);
  }
}
