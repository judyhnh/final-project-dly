import { css, Global } from '@emotion/react';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout.js';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');
    const profileResponseBody = await profileResponse.json();

    if ('errors' in profileResponseBody) {
      setUser(undefined);
    } else {
      setUser(profileResponseBody.user);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);

  return (
    <div>
      <Global
        styles={css`
          @import url(https://fonts.googleapis.com/css?family=Permanent+Marker);
          body,
          html {
            font-family: 'Permanent Marker';
            margin: 0;

            color: #333;
            background: repeating-linear-gradient(
                  90deg,
                  #f0f0f0 0,
                  #f0f0f0 5%,
                  transparent 0,
                  transparent 50%
                )
                0 / 15px 15px,
              repeating-linear-gradient(
                  180deg,
                  #f0f0f0 0,
                  #f0f0f0 5%,
                  transparent 0,
                  transparent 50%
                )
                0 / 15px 15px;
          }
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }
          ::selection {
            background: gold;
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Layout user={user}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
      </Layout>
    </div>
  );
}

export default MyApp;
