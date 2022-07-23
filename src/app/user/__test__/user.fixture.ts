import { User } from '../user.entity';
import { faker } from '@faker-js/faker';

export const getUser = (data: Partial<User> = {}) => {
  const user = new User();
  user.id = data.id || faker.datatype.number({ min: 1 });
  user.nickname = data.nickname || faker.name.lastName();
  user.email = data.email || faker.internet.email();
  user.password = data.password || 'test';
  user.createdAt = data.createdAt || new Date();
  user.updatedAt = data.updatedAt || new Date();
  return user;
};
