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
const usernameStyle = css`
  display: flex;
  font-size: 15px;
  margin-top: 40px;
  margin-right: 10px;

  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
`;

const userDropDown = css`
  position: relative;

  .dropDownMenu {
    position: absolute;
    font-size: 15px;
    left: 0;
    top: calc(65% + 0.25rem);
    background-color: white;
    padding: 0.75rem;
    border-radius: 0.25rem;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    opacity: 0;
    transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
    transform: translateY(-10px);
    pointer-events: none;
  }

  > a + .dropDownMenu {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  a {
    color: black;
    text-decoration: none;
  }
`;

function Anchor({ children, ...restProps }) {
  return <a {...restProps}>{children}</a>;
}

export default function Header(props) {
  return (
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
            <div css={userDropDown}>
              <Link href="/">
                <a>
                  <Image
                    src="/user.svg"
                    alt="icon of a user in minimalist style"
                    width="35"
                    height="35"
                  />
                </a>
              </Link>
              <div className="dropDownMenu">
                {props.user ? (
                  <Anchor href="/logout">Logout</Anchor>
                ) : (
                  <a href="/login">Login</a>
                )}
              </div>
            </div>
            <div css={usernameStyle}>{props.user && props.user.username}</div>
          </div>
        </div>
      </nav>
    </header>
  );
}
