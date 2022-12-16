import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { Entry, getEntriesByUserId } from '../../database/entries';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken } from '../../database/users';
import { createTokenFromSecret } from '../../utils/csrf';
import { buttonContainer, entryStyle, imageAndText } from '../../utils/styles';

type Props = {
  errors: { message: string }[];
  csrfToken: undefined;
  entries: Entry[];
};

export default function Entries(props: Props) {
  const [entries, setEntries] = useState<Entry[]>(props.entries);
  const [contentOnEditInput, setContentOnEditInput] = useState('');
  const [moodOnEditInput, setMoodOnEditInput] = useState('');
  const [dateOnEditInput, setDateOnEditInput] = useState('');
  const [imageOnEditInput, setImageOnEditInput] = useState('');
  const [onEditId, setOnEditId] = useState<number | undefined>();

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
        dateEntry: dateOnEditInput,
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

  return (
    <div>
      <Head>
        <title>Entries</title>
        <meta name="description" content="Overview of the diary entries." />
      </Head>
      <div css={entryStyle}>
        <h1>⑉ Overview of my entries ⑉</h1>

        {[...entries].reverse().map((entry) => {
          const isEntryOnEdit = onEditId === entry.id;

          return (
            <Fragment key={entry.id}>
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
                  spellCheck="false"
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
                      setDateOnEditInput(entry.dateEntry);
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
  const user = token && (await getUserBySessionToken(token));
  const entries = user && (await getEntriesByUserId(user.id));

  if (!session) {
    context.res.statusCode = 401;
    return { props: { errors: [{ message: 'User not authorized' }] } };
  }

  const csrfToken = await createTokenFromSecret(session.csrfSecret);

  return {
    props: { csrfToken, entries },
  };
}
