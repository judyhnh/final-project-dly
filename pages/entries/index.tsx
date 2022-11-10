import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { Entry } from '../../database/entries';
import { getValidSessionByToken } from '../../database/sessions';
import { createTokenFromSecret } from '../../utils/csrf';

const entryStyle = css`
  display: flex;
  flex-direction: column;
  margin: 60px auto;
  width: 70vw;

  h1 {
    letter-spacing: 5px;
    text-align: center;
    margin-bottom: 100px;
  }
  textarea {
    text-align: center;
    height: 300px;
    background-color: #fff;
    background-image: linear-gradient(
        90deg,
        transparent 79px,
        #abced4 79px,
        #abced4 81px,
        transparent 81px
      ),
      linear-gradient(#eee 0.1em, transparent 0.1em);
    background-size: 100% 1.2em;
    font-size: 20px;
    border-left: 3px solid black;
    border-right: 3px solid black;
  }
  .entryNr {
    margin: 25px 0 5px 0;
    font-size: 20px;
    letter-spacing: 5px;
  }

  select {
    font-size: 30px;
    background-color: rgba(255, 215, 0, 0.5);
    border-left: 3px solid black;
    border-right: 3px solid black;
  }

  input {
    font-size: 18px;
    border-left: 3px solid black;
    border-right: 3px solid black;
    border-top: 3px solid black;
  }
`;

const buttonContainer = css`
  display: flex;
  justify-content: flex-end;
  background-color: rgba(255, 215, 0, 0.5);
  gap: 2px;
  margin-bottom: 30px;
  border-left: 2px solid black;
  border-bottom: 3px solid black;
  border-right: 2px solid black;

  button {
    width: 110px;
    padding: 5px;
    cursor: pointer;
  }
  button:first-child {
    background-color: rgba(255, 215, 0, 0.5);
  }
  button:first-child :hover {
    background-color: rgba(255, 215, 0, 0.9);
  }
`;

type Props =
  | {
      errors: { message: string }[];
      csrfToken: undefined;
    }
  | { csrfToken: string };

export default function Entries(props: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [contentOnEditInput, setContentOnEditInput] = useState('');
  const [moodOnEditInput, setMoodOnEditInput] = useState('');
  const [dateOnEditInput, setDateOnEditInput] = useState('');

  const [onEditId, setOnEditId] = useState<number | undefined>();

  async function getEntriesFromApi() {
    const response = await fetch('/api/entries');
    const entriesFromApi = await response.json();

    setEntries(entriesFromApi);
  }

  async function deleteEntryFromApiById(id: number) {
    const response = await fetch(`/api/entries/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
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
        diaryContent: contentOnEditInput,
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
    <div>
      <Head>
        <title>Entries</title>
        <meta name="description" content="Overview of the diary entries." />
      </Head>
      <div css={entryStyle}>
        <h1>Overview of my entries</h1>

        {entries.map((entry) => {
          const isEntryOnEdit = onEditId === entry.id;
          return (
            <Fragment key={entry.id}>
              <div className="entryNr">Entry Nr.{entry.id}</div>

              <input
                type="date"
                value={isEntryOnEdit ? dateOnEditInput : entry.dateEntry}
                disabled={!isEntryOnEdit}
                onChange={(event) => {
                  setDateOnEditInput(event.currentTarget.value);
                }}
              />
              <select
                value={isEntryOnEdit ? moodOnEditInput : entry.mood}
                disabled={!isEntryOnEdit}
                onChange={(event) => {
                  setMoodOnEditInput(event.currentTarget.value);
                }}
              >
                <option value="😊">😊</option>
                <option value="🥲">🥲</option>
                <option value="🥰">🥰</option>
                <option value="😫">😫</option>
                <option value="😒">😒</option>
              </select>

              <textarea
                value={isEntryOnEdit ? contentOnEditInput : entry.diaryContent}
                disabled={!isEntryOnEdit}
                onChange={(event) => {
                  setContentOnEditInput(event.currentTarget.value);
                }}
              />
              <div css={buttonContainer}>
                {!isEntryOnEdit ? (
                  <button
                    onClick={() => {
                      setOnEditId(entry.id);
                      setContentOnEditInput(entry.diaryContent);
                      setMoodOnEditInput(entry.mood);
                    }}
                  >
                    <Image
                      src="/edEdit.svg"
                      alt="pencil in comic style"
                      width="20"
                      height="20"
                    />
                    EDIT
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      setOnEditId(undefined);
                      await updateEntryFromApiById(entry.id);
                    }}
                  >
                    <Image
                      src="/edConfirm.svg"
                      alt="tick"
                      width="20"
                      height="20"
                    />
                    CONFIRM
                  </button>
                )}

                <button onClick={() => deleteEntryFromApiById(entry.id)}>
                  <Image
                    src="/edDelete.svg"
                    alt="trashcan in comic style"
                    width="20"
                    height="20"
                  />
                  DELETE
                </button>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
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
