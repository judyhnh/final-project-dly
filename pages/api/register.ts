import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, getUserByUsername } from '../../database/users';

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    // check data exists
    if (
      typeof request.body.username !== 'string' ||
      typeof request.body.password !== 'string' ||
      typeof request.body.email !== 'string' ||
      !request.body.username ||
      !request.body.password ||
      !request.body.email
    ) {
      return response.status(400).json({
        errors: [{ message: 'Username, password and email are required.' }],
      });
    }

    // check if User already exists
    const user = await getUserByUsername(request.body.username);
    if (user) {
      return response
        .status(401)
        .json({ errors: [{ message: 'Username is already taken ☹︎' }] });
    }

    // hash pw
    const passwordHash = await bcrypt.hash(request.body.password, 12);

    const userWithoutPassword = await createUser(
      request.body.username,
      passwordHash,
      request.body.email,
    );

    response
      .status(200)
      .json({ user: { username: userWithoutPassword.username } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method prohibited.' }] });
  }
}
