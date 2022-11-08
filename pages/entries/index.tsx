import { css } from '@emotion/react';
import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Entry, getEntries } from '../../database/entries';

type Props = {
  entries: Entry[];
};

export default function Entries() {
  return (
    <div>
      <Head>
        <title>Entries</title>
        <meta name="description" content="Overview of the diary entries." />
      </Head>
      <h1>Overview of my entries</h1>
    </div>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<Props>
> {
  const entries = await getEntries();
  return {
    props: {
      entries: entries,
    },
  };
}
