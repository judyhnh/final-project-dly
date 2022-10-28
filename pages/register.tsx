import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const mainWrapper = css`
  width: 100vw;
  height: 500px;
  background-color: rgba(255, 215, 0, 0.5);
  margin-top: 100px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
`;

const registerWrapper = css`
  display: grid;
  grid-template-columns: 400px 380px 300px 150px;
  grid-template-rows: auto;
  grid-template-areas:
    '. image side arrow'
    '. image side arrow'
    '. image . .'
    '. image . .';
`;
const arrowRight = css`
  grid-area: arrow;
  margin-top: 150px;
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
    color: black;
    letter-spacing: 3px;
    text-decoration: none;
    border: 1.5px solid black;
    padding: 3px 5px;
    border-radius: 10px;
  }
  a:hover {
    border: 1.5px dashed blue;
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
    background: transparent;
  }
  input:focus {
    outline: none;
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

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });
    const registerResponseBody = await registerResponse.json();
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    router.push('/login').catch(() => {});
  };

  return (
    <div css={mainWrapper}>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register on Daily" />
      </Head>

      <div css={registerWrapper}>
        <div css={imageLeft}>
          <Image
            src="/registerImage.svg"
            alt="colorful hand drawn image "
            width="300"
            height="500"
          />
        </div>

        <div css={arrowRight}>
          <Image
            src="/arrowRight.svg"
            alt="arrow with loop"
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
                    setUsername(event.currentTarget.value);
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
                onClick={() => {
                  registerHandler();
                }}
              >
                SUBMIT
              </button>
            </form>
          </div>
          <p>
            Already registered? <Link href="/login">LOGIN</Link> here!
          </p>
        </div>
      </div>
    </div>
  );
}
