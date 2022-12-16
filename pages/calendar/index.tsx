import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Entry, getEntriesByUserId } from '../../database/entries';
import { getUserBySessionToken } from '../../database/users';
import { filterStyleContainer, filterStyleMonth } from '../../utils/styles';

type Props = {
  entries: Entry[];
};

export default function CalendarDisplay(props: Props) {
  const [month, setMonth] = useState();
  const [monthFilter, setMonthFilter] = useState<string>();
  const handleChange = (event: any) => {
    setMonth(event.target.value);
  };

  // const getEntriesDates: Entry['dateEntry'][] = [];
  // props.entries.map((entry) => {
  //   return getEntriesDates.push(entry.dateEntry);
  // });

  // const monthsOfEntries: [] = [];
  // getEntriesDates.map((entry) => {
  //   const splitEntry = entry.split('-')[1];
  //   return monthsOfEntries.push(splitEntry);
  //  });
  // console.log('entries', getEntriesDates);
  // console.log('months', monthsOfEntries);

  const monthsForFilter = [
    { name: 'January', dateNumber: '01' },
    { name: 'February', dateNumber: '02' },
    { name: 'March', dateNumber: '03' },
    { name: 'April', dateNumber: '04' },
    { name: 'May', dateNumber: '05' },
    { name: 'June', dateNumber: '06' },
    { name: 'July', dateNumber: '07' },
    { name: 'August', dateNumber: '08' },
    { name: 'September', dateNumber: '09' },
    { name: 'October', dateNumber: '10' },
    { name: 'November', dateNumber: '11' },
    { name: 'December', dateNumber: '12' },
  ];

  const monthsForFilterDates: string[] = [];
  monthsForFilter.map((date) => {
    return monthsForFilterDates.push(date.dateNumber);
  });

  return (
    <div>
      <Head>
        <title>Calendar</title>
        <meta
          name="description"
          content="Overview of the diary entries in a calendar"
        />
      </Head>

      <div css={filterStyleMonth}>
        <select value={month} onChange={handleChange}>
          {monthsForFilter.map((option) => (
            <option key={option.name} value={option.dateNumber}>
              {option.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setMonthFilter(month);
          }}
        >
          FILTER
        </button>
      </div>
      {[...props.entries]
        .reverse()
        .filter((entry) => {
          let filter = true;
          if (monthFilter && entry.dateEntry.split('-')[1] !== monthFilter) {
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
            </div>
          );
        })}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const entries = user && (await getEntriesByUserId(user.id));

  return {
    props: { entries },
  };
}
