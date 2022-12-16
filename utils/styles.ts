import { css } from '@emotion/react';

// calendar and private profile styling

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

// overview of entries styling

export const buttonContainer = css`
  display: flex;
  justify-content: flex-end;
  background-color: transparent;
  gap: 3px;
  margin-bottom: 60px;
  border-left: 5px solid black;
  border-right: 5px solid black;
  border-bottom: 5px solid black;

  button {
    width: 110px;
    padding: 5px;
    border: 4px solid black;
    cursor: pointer;
  }
  button:first-of-type {
    background-color: rgba(255, 215, 0, 0.5);
  }
  button:first-of-type :hover {
    background-color: rgba(255, 215, 0, 0.9);
  }
`;

export const imageAndText = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: transparent;
  border-left: 5px solid black;
  img {
    align-self: center;
    margin-left: 30px;
    opacity: 0.8;
    object-fit: scale-down;
  }
`;

export const entryStyle = css`
  display: flex;
  flex-direction: column;
  margin: 60px auto;
  width: 70vw;

  h1 {
    letter-spacing: 5px;
    text-align: center;
    margin-bottom: 120px;
    word-spacing: 20px;
  }
  textarea {
    border-top: none;
    border-bottom: none;
    border-left: none;
    border-right: 5px solid black;
    height: 300px;
    width: 50vw;
    background-color: transparent;
    font-size: 20px;
  }
  textarea:focus {
    outline: 3px solid blue;
  }

  select {
    font-size: 40px;
    background-color: transparent;
    border-left: 5px solid black;
    border-right: 5px solid black;
    border-bottom: none;
    border-top: none;
    text-align: right;
  }

  select:focus {
    background-color: rgba(243, 45, 234, 0.4);
    outline: 2px solid white;
  }

  input {
    font-size: 18px;
    border-left: 5px solid black;
    border-right: 5px solid black;
    border-top: 5px solid black;
    border-bottom: none;
    text-align: right;
    font-size: 20px;
    font-weight: bold;
    color: black;
  }
  input:focus {
    background-color: darkblue;
    color: white;
  }
`;

// create entry, entries/admin

export const entryWrapper = css`
  display: flex;
  margin: 150px auto;
  width: 70vw;
  border: 3px solid black;
  border-radius: 10px;
  background-color: rgba(255, 215, 0, 0.7);
  box-shadow: 5px 8px black;

  h1 {
    letter-spacing: 7px;
    text-align: center;
    line-height: 30px;
    padding: 20px;
  }
  label {
    font-size: 20px;
    letter-spacing: 3px;
    margin-bottom: 10px;
  }

  .dateStyle {
    margin-left: 30px;
    border: 5px solid white;
    box-shadow: 5px 5px gray;
  }
  .dateStyle:focus {
    outline: 2px solid black;
  }
  .uploadStyle {
    margin-left: 10px;
    border: 5px solid white;
    box-shadow: 5px 5px gray;
    font-family: monospace;
  }

  button {
    border: none;
    margin-left: 10px;
    cursor: pointer;
    font-size: 15px;
    letter-spacing: 5px;
    background-color: rgba(255, 215, 0, 0.7);
    color: gold;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
  }
  .imgStyle {
    margin-top: 250px;
  }
`;

export const contentStyle = css`
  display: flex;
  flex-direction: column;
  margin: 10px 50px 20px 100px;

  .textStyle {
    width: 300px;
    height: 500px;
  }

  textarea {
    width: 460px;
    height: 250px;
    margin-top: 5px;
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
    border: 2px solid white;
    font-size: 20px;
    box-shadow: 7px 7px gray;
  }
  textarea:focus {
    outline: 2px solid black;
  }
  select {
    font-size: 30px;
    width: 200px;
    text-align: center;
    border: 2px solid white;
    margin-top: 5px;
    box-shadow: 5px 5px gray;
  }
  select:focus {
    outline: 2px solid black;
  }
`;
