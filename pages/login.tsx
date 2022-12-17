import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import {
  errorStyle,
  formContainer,
  mainWrapper,
  registerStyleRight,
} from '../utils/styles';
import { LoginResponseBody } from './api/login';

const registerWrapper = css`
  display: flex;
  justify-content: center;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });

    const loginResponseBody = (await loginResponse.json()) as LoginResponseBody;

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return console.log(loginResponseBody.errors);
    }
    console.log(router.query.returnTo);
    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) &&
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      await props.refreshUserProfile();
      return await router.push(returnTo);
    }
    await props.refreshUserProfile();
    await router.push(`/private-profile`);
  }

  return (
    <div css={mainWrapper}>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login to Daily" />
      </Head>

      <div css={registerWrapper}>
        <div css={registerStyleRight}>
          <h1>Please sign in</h1>
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

              <button
                onClick={async () => {
                  await loginHandler();
                }}
              >
                LOGIN
              </button>
            </form>
          </div>
          <p>
            No Account yet? <Link href="/register">Register</Link> here!
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
