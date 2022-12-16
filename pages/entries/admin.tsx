import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Entry } from '../../database/entries';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken, User } from '../../database/users';
import { createTokenFromSecret } from '../../utils/csrf';

const entryWrapper = css`
  display: flex;
  margin: 150px auto;
  width: 70vw;
  border: 3px solid black;
  border-radius: 10px;
  background-color: rgba(255, 215, 0, 0.7);
  box-shadow: 5px 8px black;

  h1 {
    letter-spacing: 7px;
    text-align: center;
    line-height: 30px;
    padding: 20px;
  }
  label {
    font-size: 20px;
    letter-spacing: 3px;
    margin-bottom: 10px;
  }

  .dateStyle {
    margin-left: 30px;
    border: 5px solid white;
    box-shadow: 5px 5px gray;
  }
  .dateStyle:focus {
    outline: 2px solid black;
  }
  .uploadStyle {
    margin-left: 10px;
    border: 5px solid white;
    box-shadow: 5px 5px gray;
    font-family: monospace;
  }

  button {
    border: none;
    margin-left: 10px;
    cursor: pointer;
    font-size: 15px;
    letter-spacing: 5px;
    background-color: rgba(255, 215, 0, 0.7);
    color: gold;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
  }
  .imgStyle {
    margin-top: 250px;
  }
`;

const contentStyle = css`
  display: flex;
  flex-direction: column;
  margin: 10px 50px 20px 100px;

  .textStyle {
    width: 300px;
    height: 500px;
  }

  textarea {
    width: 460px;
    height: 250px;
    margin-top: 5px;
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
    border: 2px solid white;
    font-size: 20px;
    box-shadow: 7px 7px gray;
  }
  textarea:focus {
    outline: 2px solid black;
  }
  select {
    font-size: 30px;
    width: 200px;
    text-align: center;
    border: 2px solid white;
    margin-top: 5px;
    box-shadow: 5px 5px gray;
  }
  select:focus {
    outline: 2px solid black;
  }
`;

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
