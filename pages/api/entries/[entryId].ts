import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteEntryById,
  getEntryByIdAndValidSessionToken,
  updateEntryById,
} from '../../../database/entries';
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

  const entryId = Number(request.query.entryId);

  if (!entryId) {
    return response.status(404).json({ message: 'Not a valid Id' });
  }

  if (request.method === 'GET') {
    const entry = await getEntryByIdAndValidSessionToken(
      entryId,
      request.cookies.sessionToken,
    );

    if (!entry) {
      return response
        .status(404)
        .json({ message: 'Not a valid Id or not a valid session token' });
    }

    return response.status(200).json(entry);
  }

  const csrfToken = request.body?.csrfToken;

  if (!(await validateTokenWithSecret(session.csrfSecret, csrfToken))) {
    return response.status(401).json({ message: 'csrf_token is not valid' });
  }

  if (request.method === 'PUT') {
    const diaryContent = request.body?.diaryContent;
    const mood = request.body?.mood;
    const dateEntry = request.body?.dateEntry;

    if (!(diaryContent && mood && dateEntry)) {
      return response
        .status(400)
        .json({ message: 'No Entry or mood was found.' });
    }

    const newEntry = await updateEntryById(
      entryId,
      diaryContent,
      mood,
      dateEntry,
    );

    if (!newEntry) {
      return response.status(404).json({ message: 'Not a valid Id' });
    }

    // response with the new created entry
    return response.status(200).json(newEntry);
  }

  if (request.method === 'DELETE') {
    const deletedEntry = await deleteEntryById(entryId);

    if (!deletedEntry) {
      return response.status(404).json({ message: 'ID is not valid.' });
    }

    console.log(deletedEntry);

    return response.status(200).json(deletedEntry);
  }

  return response.status(400).json({ message: 'Method Not Allowed' });
}
