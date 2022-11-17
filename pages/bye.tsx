import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const mainWrapper = css`
  display: flex;
  justify-content: center;
  width: 100vw;
  margin-top: 200px;
  p {
    font-size: 30px;
    word-spacing: 10px;
    letter-spacing: 5px;
  }
`;

const imageStyle = css`
  display: flex;
  margin-top: -100px;
`;

export default function Home() {
  return (
    <div css={mainWrapper}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Overview of the cards" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div>
        <p>BYE, SEE YOU SOON!</p>
      </div>
      <div css={imageStyle}>
        <Image
          src="/registerImage.svg"
          alt="colorful hand drawn image "
          width="300"
          height="500"
        />
      </div>
    </div>
  );
}
