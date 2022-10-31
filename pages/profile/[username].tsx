import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getUserByUsername, User } from '../../database/users';

type Props = {
  user?: User;
};

export default function UserProfile(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="Error - User not found" />
        </Head>
        <h1>
          404 - User not found{' '}
          <Image
            src="/bot.svg"
            width="50"
            height="50"
            alt="sad face in comic style"
          />
        </h1>
        Better luck next time
      </>
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
  // Retrieve the username from the URL
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
