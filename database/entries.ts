import { sql } from './connect';

export type Entry = {
  id: number;
  diaryContent: string;
  mood: string;
  dateEntry: string;
};

export async function getEntries() {
  const entries = await sql<Entry[]>`
    SELECT
      *
    FROM
    entries
  `;
  return entries;
}

export async function getEntryById(id: number) {
  const [entry] = await sql<Entry[]>`
    SELECT
      *
    FROM
      entries
    WHERE
      id = ${id}
  `;
  return entry;
}

export async function createEntry(
  diaryContent: string,
  mood: number,
  dateEntry: string,
) {
  const [entry] = await sql<Entry[]>`
    INSERT INTO entries
      (diary_content, mood, date_entry)
    VALUES
      (${diaryContent}, ${mood}, ${dateEntry})
    RETURNING *
  `;
  return entry;
}

export async function updateEntryById(
  id: number,
  diaryContent: string,
  mood: string,
  dateEntry: string,
) {
  const [entry] = await sql<Entry[]>`
    UPDATE
      entries
    SET
      diary_content = ${diaryContent},
      mood = ${mood},
      date_entry = ${dateEntry}
    WHERE
      id = ${id}
    RETURNING *
  `;
  return entry;
}

export async function deleteEntryById(id: number) {
  const [entry] = await sql<Entry[]>`
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

  const [entry] = await sql<Entry[]>`
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
