import { NextApiRequest, NextApiResponse } from 'next';

export type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    response.status(200).json({ user: { username: 'judy' } });
  } else {
    response.status(401).json({ errors: [{ message: 'Method prohibited.' }] });
  }
}
