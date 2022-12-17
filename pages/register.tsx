import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { errorStyle, formContainer, mainWrapper } from '../utils/styles';
import { RegisterResponseBody } from './api/register';

const registerWrapper = css`
  display: grid;
  grid-template-columns: 400px 380px 300px 150px;
  grid-template-rows: auto;
  grid-template-areas:
    '. image side arrow'
    'text image side arrow'
    'text image . .'
    '. image . .';
`;
const textSide = css`
  grid-area: text;
  padding: 30px;
  width: 200px;
  height: 200px;
  margin-left: 200px;
  margin-top: 100px;
  font-size: 20px;
  background-color: gold;
  border: 5px dotted black;
  text-align: center;
  letter-spacing: 2px;
  border-radius: 20px;
`;

const imageLeft = css`
  grid-area: image;
`;

const registerStyleRight = css`
  margin: 0 400px 0 auto;
  grid-area: side;
  p {
    margin-left: 5px;
  }
  h1 {
    margin-left: 5px;
  }
  a {
    color: blue;
    letter-spacing: 3px;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
        email,
      }),
    });
    const registerResponseBody =
      (await registerResponse.json()) as RegisterResponseBody;

    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return console.log(registerResponseBody.errors);
    }

    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
    }

    await props.refreshUserProfile();
    await router.push(`/private-profile`);
  }

  return (
    <div css={mainWrapper}>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register on Daily" />
      </Head>

      <div css={registerWrapper}>
        <div css={textSide}>Keep a diary, and someday it will keep you.</div>
        <div css={imageLeft}>
          <Image
            src="/registerImage.svg"
            alt="colorful hand drawn image "
            width="300"
            height="500"
          />
        </div>

        <div css={registerStyleRight}>
          <h1>Create an Account</h1>
          <div css={formContainer}>
            <form className="formStyle" onSubmit={handleSubmit}>
              <label>
                <Image
                  src="/user.svg"
                  alt="icon of a user in minimalist style"
                  width="20"
                  height="20"
                />
                <input
                  placeholder="Username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value.toLowerCase());
                  }}
                />
              </label>

              <label>
                <Image
                  src="/key.svg"
                  alt="icon of a key in minimalist style"
                  width="20"
                  height="20"
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
              </label>

              <label>
                <Image
                  src="/mail.svg"
                  alt="icon of an email in minimalist style"
                  width="20"
                  height="20"
                />
                <input
                  placeholder="E-mail"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.currentTarget.value);
                  }}
                />
              </label>

              <button
                onClick={async () => {
                  await registerHandler();
                }}
              >
                SUBMIT
              </button>
            </form>
          </div>
          <p>
            Already registered? <Link href="/login">LOGIN</Link> here!
          </p>
          <div css={errorStyle}>
            {errors.map((error) => {
              return <p key={error.message}>ERROR: {error.message}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
