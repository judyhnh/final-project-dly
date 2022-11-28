import { sql } from './connect';
import { User } from './users';

export type Entry = {
  id: number;
  diaryContent: string;
  mood: string;
  dateEntry: string;
  imageFile: string;
  userId: number;
};

export async function getEntries() {
  const entries = await sql<
    {
      id: number;
      diaryContent: string;
      mood: string;
      dateEntry: string;
      imageFile: string;
      userId: number;
    }[]
  >`
    SELECT
      *
    FROM
    entries
  `;
  return entries;
}

export async function getEntriesByUserId(userId: number) {
  const entry = await sql<
    {
      id: number;
      diaryContent: string;
      mood: string;
      dateEntry: string;
      imageFile: string;
      userId: number;
    }[]
  >`
    SELECT
      *
    FROM
      entries
    WHERE
    user_id = ${userId}

  `;
  return entry;
}

export async function createEntry(
  diaryContent: string,
  mood: string,
  dateEntry: string,
  imageFile: string,
  userId: User['id'],
) {
  const [entry] = await sql<
    {
      id: number;
      diaryContent: string;
      mood: string;
      dateEntry: string;
      imageFile: string;
      userId: number;
    }[]
  >`
    INSERT INTO entries
      (diary_content, mood, date_entry, image_file, user_id)
    VALUES
      (${diaryContent}, ${mood}, ${dateEntry}, ${imageFile}, ${userId})
    RETURNING
     *
  `;
  return entry;
}

export async function updateEntryById(
  id: number,
  diaryContent: string,
  mood: string,
  dateEntry: string,
  imageFile: string,
) {
  const [entry] = await sql<
    {
      id: number;
      diaryContent: string;
      mood: string;
      dateEntry: string;
      imageFile: string;
      userId: number;
    }[]
  >`
    UPDATE
      entries
    SET
      diary_content = ${diaryContent},
      mood = ${mood},
      date_entry = ${dateEntry},
      image_file = ${imageFile}
    WHERE
      id = ${id}
    RETURNING *
  `;
  return entry;
}

export async function deleteEntryById(id: number) {
  const [entry] = await sql<
    {
      id: number;
      diaryContent: string;
      mood: string;
      dateEntry: string;
      imageFile: string;
      userId: number;
    }[]
  >`
    DELETE FROM
      entries
    WHERE
      id = ${id}
    RETURNING *
  `;
  return entry;
}

export async function getEntryByIdAndValidSessionToken(
  id: number,
  token: string | undefined,
) {
  if (!token) return undefined;

  const [entry] = await sql<
    {
      id: number;
      diaryContent: string;
      mood: string;
      dateEntry: string;
      imageFile: string;
      userId: number;
    }[]
  >`
    SELECT
      entries.*
    FROM
      entries,
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
    AND
      entries.id = ${id}
  `;
  return entry;
}
