import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  email: string;
};

export async function getUserByUsername(username: string) {
  if (!username) return undefined;
  const [user] = await sql<User[]>`
  SELECT
    *
  FROM
    Users
  WHERE
    users.username = ${username}
  `;
  return user;
}
