import { User } from '.';

export const userProvider = {
  provide: 'USER_MODEL',
  useValue: User,
};
