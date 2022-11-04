import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { createUser, getUserByUsername } from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import { createCsrfSecret } from '../../utils/csrf';

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

    const secret = await createCsrfSecret();
    const session = await createSession(
      userWithoutPassword.id,
      crypto.randomBytes(80).toString('base64'),
      secret,
    );

    const serializedCookie = createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    response
      .status(200)
      .setHeader('Set-Cookie', serializedCookie)
      .json({ user: { username: userWithoutPassword.username } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method prohibited.' }] });
  }
}
