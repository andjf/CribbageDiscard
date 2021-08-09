import React from "react";
import "./Card.css";

const SUITS = [
  ["♠", "♤"],
  ["♥", "♡"],
  ["♣", "♧"],
  ["♦", "♢"],
];

function Card({ number, suit, nextSuitFunction, nextNumberFunction, small }) {
  function getDisplayCharacter(number) {
    if (number === 1) {
      return "A";
    } else if (number === 11) {
      return "J";
    } else if (number === 12) {
      return "Q";
    } else if (number === 13) {
      return "K";
    } else {
      return number.toString();
    }
  }

  return (
    <button className={small ? "smallCard" : "card"}>
      <p
        onClick={nextNumberFunction}
        className={small ? "smallNumber" : "number"}
      >
        {getDisplayCharacter(number)}
      </p>
      <p
        onClick={nextNumberFunction}
        className={
          (small ? "smallNumber" : "number") +
          " " +
          (small ? "smallRotated" : "rotated")
        }
      >
        {getDisplayCharacter(number)}
      </p>
      <p
        onClick={nextSuitFunction}
        className={
          (small ? "smallSuit" : "suit") + (suit % 2 ? " red" : " black")
        }
      >
        {SUITS[suit][0]}
      </p>
    </button>
  );
}

export default Card;
