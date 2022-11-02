import { css } from '@emotion/react';
import Image from 'next/image';

const footerStyle = css`
  background-color: pink;
  height: 50vh;
  margin-top: 900px;
`;

const footerWrapper = css`
  display: flex;
  flex-direction: row;
`;

const textStyle = css`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  background-image: linear-gradient(
      90deg,
      transparent 79px,
      #abced4 79px,
      #abced4 81px,
      transparent 81px
    ),
    linear-gradient(#eee 0.1em, transparent 0.1em);
  background-size: 100% 1.2em;
  padding: 30px;
  width: 900px;
  border: 2.5px solid black;
  margin: 50px 0 0 20px;

  p {
    display: flex;
    justify-content: space-evenly;
    margin-top: 3px;
    letter-spacing: 5px;
    font-size: 25px;
    text-decoration: underline;
  }
  .connectIcons {
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
  }
`;

const imageStyle = css`
  display: flex;
  width: 300px;
  padding: 30px;
  margin: 50px 0 0 50px;
`;

export default function Footer() {
  return (
    <footer css={footerStyle}>
      <div css={footerWrapper}>
        <div css={imageStyle}>
          <Image src="/footer.png" width="300" height="300" />
        </div>
        <div css={textStyle}>
          <p>Connect with Daily!</p>
          <div className="connectIcons">
            <Image src="/twitter.svg" width="30" height="30" />
            <Image src="/facebook.svg" width="30" height="30" />
            <Image src="/instagram.svg" width="30" height="30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
