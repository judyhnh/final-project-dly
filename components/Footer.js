import { css } from '@emotion/react';

const footerStyle = css`
  border-top: 3px solid black;
  background-color: pink;

  margin-top: 900px;
`;

export default function Footer() {
  return <footer css={footerStyle}>This is my footer.</footer>;
}
