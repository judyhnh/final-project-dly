import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { Entry, getEntriesByUserId } from '../database/entries';
import { getUserBySessionToken, User } from '../database/users';
import { filterStyle, filterStyleContainer } from '../utils/styles';

const profileWrapper = css`
  display: flex;
  flex-direction: column;
  margin: 80px auto;
  width: 70vw;
  align-items: center;

  h1 {
    letter-spacing: 10px;
    word-spacing: 5px;
  }
  i {
    background-color: gold;
  }
  a {
    margin-left: 85vw;
    text-decoration: none;
    font-size: 10px;
    padding: 10px;
    letter-spacing: 5px;
    border: 2px solid darkblue;
    border-radius: 15px;
    font-family: Lucida Grande;
    font-weight: bold;
    color: darkblue;
  }
  a:hover {
    background-color: darkblue;
    color: white;
  }
`;

const imageStyle = css`
  height: 200px;
  margin: 100px 0 0 200px;
`;

type Props = {
  user?: User;
  entry: Entry[];
  children?: ReactNode;
  href: string;
};

function Anchor({ children, ...restProps }: Props) {
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

export default function UserProfile(props: Props) {
  const [entries, setEntries] = useState<Entry[]>(props.entry);
  const [mood, setMood] = useState();
  const [moodFilter, setMoodFilter] = useState<string>();

  const handleChangeMood = (event: any) => {
    setMood(event.target.value);
  };

  const moodArray: Entry['mood'][] = [];
  entries.map((entry) => {
    if (!moodArray.includes(entry.mood)) {
      return moodArray.push(entry.mood);
    }
    return null;
  });
  // moodArray.includes(entry.mood) ? null : moodArray.push(entry.mood)

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
        <Anchor href="/logout" entry={[]}>
          LOGOUT
        </Anchor>
        <h1>
          Welcome back, <i>??? {props.user.username} ???</i> !
        </h1>

        <div css={imageStyle}>
          <Image
            src="/arrowRight.svg"
            alt="arrow with loop"
            width="300"
            height="300"
          />
        </div>
      </div>

      <div css={filterStyle}>
        <select value={mood} onChange={handleChangeMood}>
          {moodArray.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setMoodFilter(mood);
            window.scrollTo({
              top: 700,
              behavior: 'smooth',
            });
          }}
        >
          FILTER
        </button>
      </div>
      {[...entries]
        .reverse()
        .filter((entry) => {
          let filter = true;
          if (moodFilter && entry.mood !== moodFilter) {
            filter = false;
          }
          return filter;
        })
        .map((filteredEntry) => {
          return (
            <div key={filteredEntry.id} css={filterStyleContainer}>
              <div className="entryStyle">
                <input type="date" value={filteredEntry.dateEntry} />
                <input
                  className="moodStyle"
                  value={filteredEntry.mood}
                  disabled
                />
                <div className="imageAndText">
                  <img
                    src={filteredEntry.imageFile}
                    width="200"
                    height="300"
                    alt="daily entry"
                  />

                  <textarea
                    spellCheck="false"
                    value={filteredEntry.diaryContent}
                  />
                </div>
              </div>
              <div className="returnButton">
                <button
                  onClick={() => {
                    window.scrollTo({
                      top: -700,
                      behavior: 'smooth',
                    });
                  }}
                >
                  ???
                </button>
              </div>
            </div>
          );
        })}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const entry = user && (await getEntriesByUserId(user.id));

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
