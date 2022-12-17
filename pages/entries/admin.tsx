import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useStreak } from 'use-streak';
import { Entry } from '../../database/entries';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken, User } from '../../database/users';
import { createTokenFromSecret } from '../../utils/csrf';
import { contentStyle, entryWrapper } from '../../utils/styles';

type Props = {
  errors: { message: string }[];
  csrfToken: undefined;
  cloudinaryAPI: string | undefined;
  user: User;
};

export default function EntriesAdmin(props: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [contentInput, setContentInput] = useState('');
  const [moodInput, setMoodInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [imageFile, setImageFile] = useState('');

  const router = useRouter();

  const uploadImage = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'daily_images');

    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/doaftjyzk/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();

    setImageFile(file.secure_url);
  };

  async function createEntryFromApi() {
    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        diaryContent: contentInput,
        mood: moodInput,
        dateEntry: dateInput,
        imageFile: imageFile,
        csrfToken: props.csrfToken,
        userId: props.user.id,
      }),
    });

    const entryFromApi = (await response.json()) as Entry;

    const newState = [...entries, entryFromApi];

    setEntries(newState);
    await router.push(`/entries`);
  }
  const today = new Date();
  const { currentCount } = useStreak(localStorage, today);

  function checkStreak() {
    if (moodInput === '🥲' && (currentCount > 1 || currentCount > 2)) {
      alert(
        'Oh, no! Your mood has been down for two consecutive days. Here is a serotonin booster!',
      );
      window.location.replace('https://unsplash.com/s/photos/cute-dogs');
    } else {
      return currentCount;
    }
  }

  return (
    <>
      <Head>
        <title>Write an Entry</title>
        <meta name="description" content="Create entries for your diary" />
      </Head>
      <div css={entryWrapper}>
        <h1>How was your day?</h1>
        <Image
          src="/creative.png"
          alt="arrow pointing to the right"
          width="50"
          height="50"
        />
        <div className="imgStyle">
          <Image
            className="imgStyle"
            src="/pencil3.svg"
            alt="arrow pointing to the right"
            width="300"
            height="600"
          />
        </div>

        <div css={contentStyle}>
          <label>
            Date:
            <input
              className="dateStyle"
              type="date"
              value={dateInput}
              onChange={(event) => {
                setDateInput(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            Image:
            <input
              className="uploadStyle"
              type="file"
              onChange={async (event) => {
                await uploadImage(event);
              }}
            />
          </label>
          <label>
            Text:
            <textarea
              spellCheck="false"
              value={contentInput}
              onChange={(event) => {
                setContentInput(event.currentTarget.value);
              }}
            />
          </label>
          MOOD:
          <label>
            <select
              value={moodInput}
              onChange={(event) => {
                setMoodInput(event.currentTarget.value);
              }}
            >
              <option hidden>⇣</option>
              <option value="😊">😊</option>
              <option value="🥲">🥲</option>
              <option value="🥰">🥰</option>
              <option value="😫">😫</option>
              <option value="😒">😒</option>
            </select>
          </label>
        </div>

        <button
          onClick={async () => {
            await createEntryFromApi();
            checkStreak();
          }}
        >
          <Image src="/edConfirm.svg" alt="tick" width="40" height="40" />
          SUBMIT
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const session = token && (await getValidSessionByToken(token));
  const user = token && (await getUserBySessionToken(token));

  if (!session) {
    context.res.statusCode = 401;
    return { props: { errors: [{ message: 'User not authorized' }] } };
  }

  const csrfToken = await createTokenFromSecret(session.csrfSecret);

  const cloudinaryAPI = process.env.CLOUDINARY_NAME;

  return {
    props: { csrfToken, cloudinaryAPI, user },
  };
}
