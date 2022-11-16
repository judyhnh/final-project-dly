import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Entry, getEntries } from '../database/entries';
import { getUserBySessionToken, User } from '../database/users';

const profileWrapper = css`
  display: flex;
  flex-direction: column;
  margin: 100px auto;
  width: 70vw;
  align-items: center;

  h1 {
    letter-spacing: 6px;
  }
`;

type Props = {
  user?: User;
  entry: Entry;
};
function Anchor({ children, ...restProps }) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function UserProfile(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div css={profileWrapper}>
        <h1>Welcome back, {props.user.username}!</h1>

        <Anchor href="/logout">Logout</Anchor>
      </div>

      {props.entry.id}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const entry = await getEntries();

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/private-profile',
        permanent: false,
      },
    };
  }

  return {
    props: { user, entry },
  };
}
