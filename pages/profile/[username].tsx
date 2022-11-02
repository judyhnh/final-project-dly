import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getUserByUsername, User } from '../../database/users';

type Props = {
  user?: User;
};

const errorWrapper = css`
  display: flex;
  margin-top: 150px;
  padding: 100px 500px;
  width: 100vw;
  height: 50vh;
  background-color: gold;
  border-top: 5px dashed black;
  border-bottom: 5px dashed black;
`;

const contentStyle = css`
  display: flex;
  flex-direction: column;
  height: 300px;
  align-items: center;

  h1 {
    display: flex;
    letter-spacing: 3px;
    margin-top: 10px;
  }

  p {
    display: flex;
    font-size: 20px;
    letter-spacing: 2px;
  }
  a {
    text-decoration: none;
    margin-left: 15px;
    color: black;
  }
  a:hover {
    text-decoration: underline;
    color: blue;
  }
`;

export default function UserProfile(props: Props) {
  if (!props.user) {
    return (
      <div css={errorWrapper}>
        <Head>
          <title>User not found</title>
          <meta name="description" content="Error - User not found" />
        </Head>
        <div css={contentStyle}>
          <h1>404 - User not found.</h1>
          <Image
            src="/bot.svg"
            width="80"
            height="80"
            alt="sad face in comic style"
          />
          <p>
            Try again here: <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Personal profile of user" />
      </Head>
      <h1>Personal Information</h1>
      id: {props.user.id} username: {props.user.username}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const username = context.query.username as string;
  const user = await getUserByUsername(username.toLowerCase());

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  return {
    props: { user },
  };
}
