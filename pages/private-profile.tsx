import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getUserBySessionToken, User } from '../database/users';

type Props = {
  user?: User;
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
      <h1>Personal Information</h1>
      id: {props.user.id} username: {props.user.username}
      <Anchor href="/logout">Logout</Anchor>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/private-profile',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}
