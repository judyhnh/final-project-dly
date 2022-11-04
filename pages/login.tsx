import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { LoginResponseBody } from './api/login';

const mainWrapper = css`
  width: 100vw;
  height: 500px;
  background-color: rgba(255, 215, 0, 0.5);
  margin-top: 100px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  border: 3px solid black;
`;

const registerWrapper = css`
  display: flex;
  justify-content: center;
`;

const registerStyleRight = css`
  p {
    margin-left: 5px;
  }
  h1 {
    margin-left: 12px;
    letter-spacing: 5px;
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

const formContainer = css`
  display: flex;
  flex-direction: column;
  border: 3px solid black;
  padding: 50px 0;
  margin: 0 auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  width: 300px;
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

  .formStyle {
    flex-direction: column;
    display: flex;
  }
  input {
    margin: 10px 0 10px 10px;
    display: inline-block;
    height: 30px;
    border: 2px dashed black;
    font-size: 15px;
    background-color: transparent;
  }

  input:focus {
    outline: 2px solid gold;
  }

  label {
    display: inline-block;
    flex-direction: column;
    align-self: center;
  }

  button {
    margin-top: 50px;
    height: 40px;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: 4px;
    color: white;
    background-color: black;
    border: 3px solid white;
    cursor: pointer;
  }
  button:hover {
    border: 3px solid gold;
    color: gold;
  }
`;

const errorStyle = css`
  background-color: white;
  color: red;
  letter-spacing: 3px;
  text-align: center;
  margin-top: 30px;
  width: 300px;
`;

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const router = useRouter();

  const handleSubmit = (event) => {
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
