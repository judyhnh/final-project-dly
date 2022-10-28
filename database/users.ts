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

export async function createUser(
  username: string,
  password_hash: string,
  email: string,
) {
  const [userWithoutPassword] = await sql<{ id: number; username: string }[]>`
  INSERT INTO users
    (username, password_hash, email)
  VALUES
    (${username}, ${password_hash}, ${email})
  RETURNING
    id,
    username

  `;

  return userWithoutPassword!;
}
