import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { Entry, getEntries } from '../../database/entries';
import { getValidSessionByToken } from '../../database/sessions';
import { createTokenFromSecret } from '../../utils/csrf';

const imageAndText = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: transparent;
  border-left: 5px solid black;
  img {
    align-self: center;
    margin-left: 30px;
  }
`;

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
    border-top: none;
    border-bottom: none;
    border-left: none;
    border-right: 5px solid black;
    height: 300px;
    width: 50vw;
    background-color: transparent;
    font-size: 20px;
  }
  textarea:focus {
    outline: 5px solid blue;
  }
  .entryNr {
    margin: 25px 0 5px 0;
    font-size: 20px;
    letter-spacing: 5px;
  }

  select {
    font-size: 40px;
    background-color: rgba(255, 215, 0, 0.5);
    border-left: 5px solid black;
    border-right: 5px solid black;
    border-bottom: none;
    border-top: none;
    text-align: right;
  }

  select:focus {
    background-color: rgba(243, 45, 234, 0.4);
    outline: 2px solid white;
  }

  input {
    font-size: 18px;
    border-left: 5px solid black;
    border-right: 5px solid black;
    border-top: 5px solid black;
    border-bottom: none;
    text-align: right;
    font-size: 20px;
    font-weight: bold;
    color: black;
  }
  input:focus {
    background-color: blue;
    color: white;
  }
`;

const buttonContainer = css`
  display: flex;
  justify-content: flex-end;
  background-color: rgba(255, 215, 0, 0.5);
  gap: 3px;
  margin-bottom: 40px;
  border-left: 5px solid black;
  border-right: 5px solid black;
  border-bottom: 5px solid black;

  button {
    width: 110px;
    padding: 5px;
    border: 4px solid black;
    cursor: pointer;
  }
  button:first-of-type {
    background-color: rgba(255, 215, 0, 0.5);
  }
  button:first-of-type :hover {
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
  const [imageOnEditInput, setImageOnEditInput] = useState('');
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
        imageFile: imageOnEditInput,
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
              <div css={imageAndText}>
                <img
                  src={entry.imageFile}
                  width="200"
                  height="300"
                  alt="daily entry"
                />

                <textarea
                  value={
                    isEntryOnEdit ? contentOnEditInput : entry.diaryContent
                  }
                  disabled={!isEntryOnEdit}
                  onChange={(event) => {
                    setContentOnEditInput(event.currentTarget.value);
                  }}
                />
              </div>

              <div css={buttonContainer}>
                {!isEntryOnEdit ? (
                  <button
                    onClick={() => {
                      setOnEditId(entry.id);
                      setContentOnEditInput(entry.diaryContent);
                      setMoodOnEditInput(entry.mood);
                      setImageOnEditInput(entry.imageFile);
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

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        'Do you really want to delete this entry? ☹️',
                      )
                    ) {
                      deleteEntryFromApiById(entry.id).catch(() => {});
                    }
                  }}
                >
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
  const entries = await getEntries();

  if (!session) {
    context.res.statusCode = 401;
    return { props: { errors: [{ message: 'User not authorized' }] } };
  }

  const csrfToken = await createTokenFromSecret(session.csrfSecret);

  return {
    props: { csrfToken, entries },
  };
}
