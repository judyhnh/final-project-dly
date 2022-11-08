import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  async function getEntriesFromApi() {
    const response = await fetch('/api/entries');
    const entriesFromApi = await response.json();

    setEntries(entriesFromApi);
  }
  async function createEntryFromApi() {
    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        diaryContent: contentInput,
        mood: moodInput,
        csrfToken: props.csrfToken,
      }),
    });
    const entryFromApi = (await response.json()) as Entry;

    const newState = [...entries, entryFromApi];

    setEntries(newState);
    await router.push(`/entries`);
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
        <input type="radio" value="1" name="test" />
        <Image
          src="/user.svg"
          alt="icon of a user in minimalist style"
          width="20"
          height="20"
        />
      </label>
      <label>
        <input type="radio" value="2" name="test" />
        <Image
          src="/user.svg"
          alt="icon of a user in minimalist style"
          width="20"
          height="20"
        />
      </label>

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
          type="number"
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
