import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';

const mainContainer = css`
  background: #202731;
  height: 100vh;
  section {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 400px;
    padding-top: 100px;
    align-items: center;
  }
  .textContainer {
    background-color: rgba(255, 255, 255, 0.85);
    width: 50vw;
    height: 60vh;
    border-top-left-radius: 90px;
    border-top-right-radius: 90px;
    border: 5px solid #202731;

    h1 {
      margin: 80px 15px 0 90px;
      font-size: 60px;
      font-family: monospace;
      text-align: right;

      b {
        font-size: 80px;
        letter-spacing: 3px;
        text-shadow: 3px 3px 3px gold;
      }
    }
  }

  .first {
    background-color: gold;
  }
  .curve {
    position: absolute;
    height: 250px;
    width: 100%;
    bottom: 0;
    text-align: center;
  }
  .curve::before {
    content: '';
    display: block;
    position: absolute;
    border-radius: 100% 50%;
    width: 55%;
    height: 100%;
    transform: translate(85%, 60%);
    background-color: hsl(216, 21%, 16%);
  }
  .curve::after {
    content: '';
    display: block;
    position: absolute;
    border-radius: 100% 50%;
    width: 55%;
    height: 100%;
    background-color: #3c31dd;
    transform: translate() (-4%, 40%);
    z-index: -1;
  }
`;

const quoteContainer = css`
  width: 100vw;
  display: flex;
  margin-right: 100px;

  .quoteTextContainer {
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin: 0 80px 0 10px;
    border: 3px dashed black;

    p {
      letter-spacing: 2px;
      margin-bottom: 0;
      font-size: 25px;
      word-spacing: 5px;
    }
  }
`;


export default function Home() {
  return (
    <div css={mainContainer}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Landing page" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-apple-touch.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <section className="first">
        <div className="textContainer">
          <h1>
            <b>DaiLY</b> a daily Diary
          </h1>

          <Image
            src="/tableSetup.svg"
            alt="colorful hand drawn image "
            width="250"
            height="250"
          />
        </div>
        <div className="curve"></div>
      </section>

      <p>
        What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum has been the industry's standard
        dummy text ever since the 1500s, when an unknown printer took a galley
        of type and scrambled it to make a type specimen book. It has survived
        not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with
        the release of Letraset sheets containing Lorem Ipsum passages, and more
        recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </p>
      <section>
        <Image
          src="/arrowRight.svg"
          alt="arrow with loop"
          width="200"
          height="200"
        />
      </section>

      <div css={quoteContainer}>
        <Image
          src="/drawing.svg"
          alt="colorful hand drawn image "
          width="300"
          height="300"
        />
        <div className="quoteTextContainer">
          <p>
            My diary is like my best friend, with the difference it keeps all my
            secrets safe. I like my diary.
          </p>
          <p>by J. H.</p>
        </div>
      </div>
    </div>
  );
}
