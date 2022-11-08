import { NextApiRequest, NextApiResponse } from 'next';
import { createEntry, getEntries } from '../../../database/entries';
import { getValidSessionByToken } from '../../../database/sessions';
import { validateTokenWithSecret } from '../../../utils/csrf';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const session =
    request.cookies.sessionToken &&
    (await getValidSessionByToken(request.cookies.sessionToken));

  if (!session) {
    response
      .status(400)
      .json({ errors: [{ message: 'No valid session token passed' }] });
    return;
  }

  if (request.method === 'GET') {
    const entries = await getEntries();

    return response.status(200).json(entries);
  }

  if (request.method === 'POST') {
    if (!request.cookies.sessionToken) {
      response
        .status(400)
        .json({ errors: [{ message: 'No session token passed' }] });
      return;
    }

    const diaryContent = request.body?.diaryContent;
    const mood = request.body?.mood;
    const csrfToken = request.body?.csrfToken;

    if (!(await validateTokenWithSecret(session.csrfSecret, csrfToken))) {
      return response.status(401).json({ message: 'csrf_token is not valid' });
    }

    if (!(diaryContent && mood)) {
      return response
        .status(400)
        .json({ message: 'Diary Content or Mood entry is missing.' });
    }

    const newEntry = await createEntry(diaryContent, mood);

    return response.status(200).json(newEntry);
  }

  return response.status(400).json({ message: 'Method prohibited.' });
}
