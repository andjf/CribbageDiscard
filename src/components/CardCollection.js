import React from "react";
import { useState } from "react";
import "./CardCollection.css";
import LeftRightButton from "./LeftRightButton";
import Card from "./Card";
import { CardObj, Decider } from "../Solver";
import Popup from "./Popup";

function CardCollection({ numberOfCards }) {
  function generateListOfRandomCards(n) {
    const toReturn = [];

    for (let i = 0; i < n; i++) {
      let exists = true;
      let numberTry;
      let suitTry;
      while (exists) {
        numberTry = Math.floor(Math.random() * 13) + 1;
        suitTry = Math.floor(Math.random() * 4);
        exists = false;
        for (let j = 0; j < toReturn.length && !exists; j++) {
          if (
            toReturn[j].number === numberTry &&
            toReturn[j].suit === suitTry
          ) {
            exists = true;
          }
        }
      }
      toReturn.push({ number: numberTry, suit: suitTry });
    }
    return toReturn;
  }

  function nextSuitOfCurrentIndex() {
    const newCards = [...cards];
    const currentSuit = newCards[currentIndex].suit;
    if (currentSuit === 3) {
      newCards[currentIndex].suit = 0;
    } else {
      newCards[currentIndex].suit++;
    }
    setCards(newCards);
  }

  function nextNumberOfCurrentIndex() {
    const newCards = [...cards];
    const currentNumber = newCards[currentIndex].number;
    if (currentNumber === 13) {
      newCards[currentIndex].number = 1;
    } else {
      newCards[currentIndex].number++;
    }
    setCards(newCards);
  }

  function previous() {
    if (currentIndex === 0) {
      setCurrentIndex(cards.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function next() {
    if (currentIndex === cards.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function clickedCheck() {
    const cardObjects = cards.map(
      (card) => new CardObj(card.number, card.suit)
    );
    setBestDiscards(Decider.bestDiscards(cardObjects));
    setTrigger(true);
  }

  const [cards, setCards] = useState(generateListOfRandomCards(numberOfCards));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bestDiscards, setBestDiscards] = useState(undefined);
  const [trigger, setTrigger] = useState(false);

  return (
    <>
      <h1>Card number {currentIndex + 1}</h1>

      <Card
        number={cards[currentIndex].number}
        suit={cards[currentIndex].suit}
        nextSuitFunction={nextSuitOfCurrentIndex}
        nextNumberFunction={nextNumberOfCurrentIndex}
        small={false}
      />

      <LeftRightButton next={next} previous={previous} />

      <button onClick={clickedCheck} className="checkButton">
        Check
      </button>

      {bestDiscards === undefined ? (
        ""
      ) : (
        <Popup trigger={trigger} setTrigger={setTrigger}>
          <h2>{"Best discard" + (bestDiscards.length === 2 ? "s" : "")}</h2>
          {bestDiscards.map((card, i) => (
            <Card
              key={i}
              number={card.number}
              suit={card.suit}
              nextSuitFunction={() => false}
              nextNumberFunction={() => false}
              small={true}
            />
          ))}
        </Popup>
      )}
    </>
  );
}

export default CardCollection;
