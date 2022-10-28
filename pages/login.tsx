import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const mainWrapper = css`
  width: 100vw;
  height: 500px;
  background-color: rgba(255, 215, 0, 0.5);
  margin-top: 100px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
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
    background-color: transparent;
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
    background-color: rgba(0, 0, 0, 0.8);
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

  return (
    <div css={mainWrapper}>
      <Head>
        <title>Register</title>
        <meta name="description" content="Login to Daily" />
      </Head>

      <div css={registerWrapper}>
        <div css={registerStyleRight}>
          <h1>Please log in</h1>

          <div css={formContainer}>
            <form className="formStyle">
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
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                />
              </label>

              <button>LOGIN</button>
            </form>
          </div>
          <p>
            No Account yet? <Link href="/register">Register</Link> here!
          </p>
        </div>
      </div>
    </div>
  );
}
