import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import { Entry } from '../../database/entries';
import { getValidSessionByToken } from '../../database/sessions';
import { createTokenFromSecret } from '../../utils/csrf';

type Props =
  | {
      errors: { message: string }[];
      csrfToken: undefined;
    }
  | { csrfToken: string };

export default function EntriesAdmin(props: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [contentInput, setContentInput] = useState('');
  const [moodInput, setMoodInput] = useState<number>();

  const [contentOnEditInput, setContentOnEditInput] = useState('');
  const [moodOnEditInput, setMoodOnEditInput] = useState<number>();

  const [onEditId, setOnEditId] = useState<number | undefined>();

  async function getEntriesFromApi() {
    const response = await fetch('/api/entries');
    const entriesFromApi = await response.json();

    setEntries(entriesFromApi);

    console.log('RESULT', response);
  }
  async function createEntryFromApi() {
    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        diary_content: contentInput,
        mood: moodInput,
        csrfToken: props.csrfToken,
      }),
    });
    const entryFromApi = (await response.json()) as Entry;

    const newState = [...entries, entryFromApi];

    setEntries(newState);
  }

  async function deleteEntryFromApiById(id: number) {
    const response = await fetch(`/api/entries/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ csrfToken: props.csrfToken }),
    });
    const deletedEntry = (await response.json()) as Entry;

    const filteredEntries = entries.filter((entry) => {
      return entry.id !== deletedEntry.id;
    });

    setEntries(filteredEntries);
  }

  async function updateEntryFromApiById(id: number) {
    const response = await fetch(`/api/entries/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        diary_content: contentOnEditInput,
        mood: moodOnEditInput,
        csrfToken: props.csrfToken,
      }),
    });
    const updatedEntryFromApi = (await response.json()) as Entry;

    const newState = entries.map((entry) => {
      if (entry.id === updatedEntryFromApi.id) {
        return updatedEntryFromApi;
      } else {
        return entry;
      }
    });

    setEntries(newState);
  }

  useEffect(() => {
    getEntriesFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  if ('errors' in props) {
    return (
      <div>
        {props.errors.map((error) => {
          return <div key={error.message}>{error.message}</div>;
        })}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Write an Entry</title>
        <meta name="description" content="Create entries for your diary" />
      </Head>

      <h1>Create an Entry</h1>

      <label>
        Text:
        <br />
        <input
          value={contentInput}
          onChange={(event) => {
            setContentInput(event.currentTarget.value);
          }}
        />
      </label>
      <br />
      <label>
        Mood:
        <br />
        <input
          value={moodInput}
          onChange={(event) => {
            setMoodInput(parseInt(event.currentTarget.value));
          }}
        />
      </label>
      <br />

      <button
        onClick={async () => {
          await createEntryFromApi();
        }}
      >
        Submit
      </button>

      <hr />

      {entries.map((entry) => {
        const isEntryOnEdit = onEditId === entry.id;
        return (
          <Fragment key={entry.id}>
            <input
              value={isEntryOnEdit ? contentOnEditInput : entry.diaryContent}
              disabled={!isEntryOnEdit}
              onChange={(event) => {
                setContentOnEditInput(event.currentTarget.value);
              }}
            />
            <input
              type="number"
              value={isEntryOnEdit ? moodOnEditInput : entry.mood}
              disabled={!isEntryOnEdit}
              onChange={(event) => {
                setMoodOnEditInput(parseInt(event.currentTarget.value));
              }}
            />

            <button onClick={() => deleteEntryFromApiById(entry.id)}>
              DELETE
            </button>
            {!isEntryOnEdit ? (
              <button
                onClick={() => {
                  setOnEditId(entry.id);
                  setContentOnEditInput(entry.diaryContent);
                  setMoodOnEditInput(entry.mood);
                }}
              >
                EDIT
              </button>
            ) : (
              <button
                onClick={async () => {
                  setOnEditId(undefined);
                  await updateEntryFromApiById(entry.id);
                }}
              >
                SAVE
              </button>
            )}
            <br />
          </Fragment>
        );
      })}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const session = token && (await getValidSessionByToken(token));

  if (!session) {
    context.res.statusCode = 401;
    return { props: { errors: [{ message: 'User not authorized' }] } };
  }

  const csrfToken = await createTokenFromSecret(session.csrfSecret);

  return {
    props: { csrfToken },
  };
}
