import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { getUserWithPasswordHashByUsername } from '../../database/users';
import { createSerializedRegisterSessionTokenCookie } from '../../utils/cookies';
import { createCsrfSecret } from '../../utils/csrf';

export type LoginResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LoginResponseBody>,
) {
  if (request.method === 'POST') {
    // check data exists
    if (
      typeof request.body.username !== 'string' ||
      typeof request.body.password !== 'string' ||
      typeof request.body.email !== 'string' ||
      !request.body.username ||
      !request.body.password
    ) {
      return response
        .status(400)
        .json({ errors: [{ message: 'Username or password invalid. ☹︎' }] });
    }

    // get user by username
    const user = await getUserWithPasswordHashByUsername(request.body.username);
    if (!user) {
      return response
        .status(401)
        .json({ errors: [{ message: 'Username not found. ☹︎' }] });
    }

    // match hash and pw
    const isPasswordValid = await bcrypt.compare(
      request.body.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return response
        .status(401)
        .json({ errors: [{ message: 'Password is not valid.' }] });
    }
    const secret = await createCsrfSecret();
    const session = await createSession(
      user.id,
      crypto.randomBytes(80).toString('base64'),
      secret,
    );
    const serializedCookie = createSerializedRegisterSessionTokenCookie(
      session.token,
    );

    response
      .status(200)
      .setHeader('Set-Cookie', serializedCookie)
      .json({ user: { username: user.username } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method prohibited.' }] });
  }
}
