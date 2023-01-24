const chatTypeChecker = <chatType extends string>(...values: chatType[]) => {
  return function (value: unknown): chatType | false {
    if (typeof value !== 'string') return false;
    return values.includes(value as chatType) ? (value as chatType) : false;
  };
};

const chatType = ['TEXT', 'LINK', 'PHOTO', 'PHOTOS'] as const;
export type ChatType = typeof chatType[number];
export const isChatType = chatTypeChecker(...chatType);
