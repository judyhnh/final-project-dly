import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';

const headerWrapper = css`
  display: flex;
  flex-direction: row;
  font-size: 50px;
  width: 100vw;

  a {
    margin-left: 10px;
  }

  .navRight {
    display: flex;
    margin: 5px 70px 0 auto;

    a {
      margin-right: 20px;
    }
    a:hover {
      box-shadow: 3px 5px 8px gold, 0px 0px 0px 5px gold;
    }
  }

  .navLeft {
    margin-left: 60px;
    font-size: 50px;
    letter-spacing: 15px;
    display: flex;
    text-shadow: 3px 3px 3px gold;
    a {
      text-decoration: none;
      color: black;
    }
  }
  .logo {
    display: flex;
    margin-top: 50px;
  }
`;

const registerStyle = css`
  font-size: 30px;
  letter-spacing: 5px;
  height: 40px;
  padding: 10px;
  a {
    text-decoration: none;
    color: black;
  }
  a:hover {
    color: blue;
  }
`;

export default function Header(props) {
  return (
    <header>
      {props.user ? (
        <nav>
          <div css={headerWrapper}>
            <div className="navLeft">
              <Link href="/">DLY</Link>
              <div className="logo">
                <Image
                  src="/vectorHeader.png"
                  alt="curvy arrow pointing to the right direction"
                  width="250"
                  height="50"
                />
              </div>
            </div>
            <div className="navRight">
              <Link href="/">
                <a>
                  <Image
                    src="/note.svg"
                    alt="icon of a notepad with a pencil in comic style"
                    width="35"
                    height="35"
                  />
                </a>
              </Link>
              <Link href="/">
                <a>
                  <Image
                    src="/calendar.svg"
                    alt="icon of a calendar in comic style"
                    width="35"
                    height="35"
                  />
                </a>
              </Link>
              <Link href="/">
                <a>
                  <Image
                    src="/setting.svg"
                    alt="icon of a wheel in comic style"
                    width="35"
                    height="35"
                  />
                </a>
              </Link>

              <Link href="/private-profile">
                <a>
                  <Image
                    src="/user.svg"
                    alt="icon of a user in minimalist style"
                    width="35"
                    height="35"
                  />
                </a>
              </Link>
            </div>
          </div>
        </nav>
      ) : (
        <header>
          <nav>
            <div css={headerWrapper}>
              <div className="navLeft">
                <Link href="/">DLY</Link>
                <div className="logo">
                  <Image
                    src="/vectorHeader.png"
                    alt="curvy arrow pointing to the right direction"
                    width="250"
                    height="50"
                  />
                </div>
              </div>
              <div className="navRight">
                <div css={registerStyle}>
                  <Link href="/register">Get started</Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
      )}
    </header>
  );
}
