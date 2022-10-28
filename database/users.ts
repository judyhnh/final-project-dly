import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  password: string;
  email: string;
};
