import { css } from '@emotion/react';

export const filterStyleMonth = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 50vw;
  margin: 100px auto;
  gap: 5px;

  select {
    width: 200px;
    text-align: center;
    font-size: 20px;
    background-color: transparent;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid grey;
  }

  select:focus {
    outline: 1px solid gold;
    border: 2px solid gold;
  }

  button {
    width: 150px;
    font-size: 20px;
    letter-spacing: 4px;
    background-color: black;
    color: white;
    border-radius: 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: gold;
    color: black;
    border-radius: 2px solid gold;
  }
`;

export const filterStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 50vw;
  margin: 100px auto;
  gap: 5px;

  select {
    width: 200px;
    text-align: center;
    font-size: 40px;
    background-color: transparent;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid grey;
  }

  select:focus {
    outline: 1px solid gold;
    border: 2px solid gold;
  }

  button {
    width: 150px;
    font-size: 20px;
    letter-spacing: 4px;
    background-color: black;
    color: white;
    border-radius: 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: gold;
    color: black;
    border-radius: 2px solid gold;
  }
`;

export const filterStyleContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px 10px;
  width: 100vw;

  .entryStyle {
    display: flex;
    flex-direction: column;
    width: 800px;
    background-color: gold;
    flex-wrap: nowrap;
  }

  .imageAndText {
    display: flex;
    flex-direction: row;
  }

  textarea {
    width: 600px;
    text-decoration: none;
  }
  textarea:focus {
    outline: 2px solid gold;
  }

  img {
    opacity: 0.8;
  }
  input {
    text-align: right;
    font-size: 20px;
  }
  input:focus {
    outline: 2px solid gold;
  }
  .moodStyle {
    font-size: 35px;
  }

  .returnButton {
    margin: 5px 0 0 735px;

    button {
      width: 60px;

      font-size: 30px;
      text-align: center;
      letter-spacing: 4px;
      background-color: transparent;
      color: darkblue;

      cursor: pointer;
    }
    button:hover {
      color: white;
      border-radius: 2px solid gold;
      background-color: darkgrey;
    }
  }
`;
