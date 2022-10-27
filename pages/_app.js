import { css, Global } from '@emotion/react';
import Head from 'next/head';
import Layout from '../components/Layout.js';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Global
        styles={css`
          @import url(https://fonts.googleapis.com/css?family=Permanent+Marker);
          body,
          html {
            background-color: #fff9f0;
            font-family: 'Permanent Marker';
            margin: 0;
          }
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }
        `}
      />
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  );
}

export default MyApp;
