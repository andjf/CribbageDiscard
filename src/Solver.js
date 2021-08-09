// Old. Should be optimized
class CardObj {
  static NUMBERS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  static SUITS = ["♠", "♥", "♣", "♦"];

  constructor(number, suit) {
    this.number = number;
    this.suit = suit;
    this.value = Math.min(10, this.number);
  }

  getCardDisplay() {
    return CardObj.NUMBERS[this.number - 1] + CardObj.SUITS[this.suit];
  }
}

class Scorer {
  static scoreHand(cards, drawCard) {
    if (cards.length !== 4 || drawCard === undefined) {
      throw new Error("Tried to score hand that didn't have 5 cards");
    }
    let points = 0;
    points += this.pointsFromFifteens(cards.concat(drawCard));
    points += this.pointsFromPairs(cards.concat(drawCard));
    points += this.pointsFromRuns(cards.concat(drawCard));
    points += this.pointsFromKnobs(cards, drawCard);
    points += this.pointsFromFlush(cards.concat(drawCard));
    return points;
  }

  static pointsFromFlush(allCards) {
    let sameSuits = allCards.map((card, index) =>
      index === allCards.length - 1
        ? false
        : card.suit === allCards[index + 1].suit
    );
    sameSuits.pop();
    return 5 * sameSuits.every((val) => val);
  }

  static pointsFromKnobs(hand, draw) {
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].number === 11 && hand[i].suit === draw.suit) {
        return 1;
      }
    }
    return 0;
  }

  static pointsFromPairs(allCards) {
    let total = 0;
    for (let i = 0; i < allCards.length; i++) {
      for (let j = i + 1; j < allCards.length; j++) {
        if (allCards[i].number === allCards[j].number) {
          total += 2;
        }
      }
    }
    return total;
  }

  static numbersBetweenWithout(start, end, without) {
    let toReturn = [];
    let current = start;
    while (current <= end) {
      if (current !== without) {
        toReturn.push(current);
      }
      current++;
    }
    return toReturn;
  }

  static createFifteensPossibleCombos() {
    let toReturn = [];
    for (let i = 0; i <= 4; i++) {
      toReturn.push(this.numbersBetweenWithout(0, 4, i));
    }
    for (let first = 0; first <= 3; first++) {
      for (let second = first + 1; second <= 4; second++) {
        toReturn.push([first, second]);
      }
    }
    for (let first = 0; first <= 2; first++) {
      for (let second = first + 1; second <= 3; second++) {
        for (let third = second + 1; third <= 4; third++) {
          toReturn.push([first, second, third]);
        }
      }
    }
    return toReturn;
  }

  static pointsFromFifteens(allCards) {
    let total = 0;
    let indexesOfPossibleFifteens = this.createFifteensPossibleCombos();
    for (let i = 0; i < indexesOfPossibleFifteens.length; i++) {
      let currentSetArray = indexesOfPossibleFifteens[i];
      let currentSum = 0;
      for (let j = 0; j < currentSetArray.length; j++) {
        currentSum += allCards[currentSetArray[j]].value;
        if (currentSum > 15) {
          break;
        }
      }
      total += currentSum === 15;
    }
    return total * 2;
  }

  static pointsFromRuns(allCards) {
    let numbersOnly = allCards.map((card) => card.number).sort((a, b) => a - b);

    let noDuplicates = [];
    let duplicates = [];
    for (let i = 0; i < numbersOnly.length; i++) {
      if (noDuplicates.indexOf(numbersOnly[i]) === -1) {
        noDuplicates.push(numbersOnly[i]);
      } else {
        duplicates.push(numbersOnly[i]);
      }
    }

    let maxStreak = 1;
    let currentNumber = noDuplicates[0];
    let currentStreak = 1;
    for (let i = 1; i < noDuplicates.length; i++) {
      if (noDuplicates[i] === currentNumber + 1) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 1;
      }
      currentNumber = noDuplicates[i];
    }

    let duplicatesNoDuplicates = [];
    for (let i = 0; i < duplicates.length; i++) {
      if (duplicatesNoDuplicates.indexOf(duplicates[i]) === -1) {
        duplicatesNoDuplicates.push(duplicates[i]);
      }
    }

    let numberToGetCount = duplicatesNoDuplicates[0];
    let count = 0;
    for (let i = 0; i < numbersOnly.length; i++) {
      count += numbersOnly[i] === numberToGetCount;
    }

    let duplicateLength = count;
    if (duplicateLength === 0) {
      duplicateLength = 1;
    }

    let numDuplicates = duplicatesNoDuplicates.length;
    if (numDuplicates === 0) {
      numDuplicates = 1;
    }

    let runLength = maxStreak;
    if (runLength < 3) {
      runLength = 0;
    }

    return duplicateLength * numDuplicates * runLength;
  }
}

class Decider {
  static getFullDeckWithout(cards) {
    let deck = [];
    for (let suit = 0; suit < 4; suit++) {
      for (let number = 1; number <= 13; number++) {
        for (let card of cards) {
          if (!(card.number === number && card.suit === suit)) {
            deck.push(new CardObj(number, suit));
          }
        }
      }
    }

    return deck;
  }

  static removeCard(cards, indexToRemove) {
    let leftOverCards = [...cards];
    leftOverCards.splice(indexToRemove, 1);
    return leftOverCards;
  }

  static bestDiscards(hand) {
    let handCopy = [...hand];
    if (handCopy.length === 5) {
      let scoresForEachCard = Array(handCopy.length).fill(0);

      let restOfCards = this.getFullDeckWithout(handCopy);

      for (
        let removeCardIndex = 0;
        removeCardIndex < handCopy.length;
        removeCardIndex++
      ) {
        let handWithout = this.removeCard(handCopy, removeCardIndex);
        for (
          let drawCardIndex = 0;
          drawCardIndex < restOfCards.length;
          drawCardIndex++
        ) {
          scoresForEachCard[removeCardIndex] += Scorer.scoreHand(
            handWithout,
            restOfCards[drawCardIndex]
          );
        }
      }

      // this is inside of it's own list so that you can iterate over it
      // the client code in this situation may not know the number of discards
      // (the number of players), so they need to be able to account for 2 or
      // 1 discard
      return [hand[scoresForEachCard.indexOf(Math.max(...scoresForEachCard))]];
    } else if (handCopy.length === 6) {
      let scoresForEachPair = new Array(15).fill(0);
      let restOfCards = this.getFullDeckWithout(handCopy);
      let manualCounter = 0;

      for (let first = 0; first < handCopy.length - 1; first++) {
        for (let second = first + 1; second < handCopy.length; second++) {
          // you have to remove the second index first, then the first index
          let handWithoutCards = this.removeCard(
            this.removeCard(handCopy, second),
            first
          );
          for (
            let drawCardIndex = 0;
            drawCardIndex < restOfCards.length;
            drawCardIndex++
          ) {
            scoresForEachPair[manualCounter] += Scorer.scoreHand(
              handWithoutCards,
              restOfCards[drawCardIndex]
            );
          }
          manualCounter++;
        }
      }

      let indexOfMaximum = scoresForEachPair.indexOf(
        Math.max(...scoresForEachPair)
      );
      manualCounter = 0;
      for (let first = 0; first < handCopy.length - 1; first++) {
        for (let second = first + 1; second < handCopy.length; second++) {
          if (manualCounter === indexOfMaximum) {
            return [hand[first], hand[second]];
          }
          manualCounter++;
        }
      }
      throw new Error(
        "Error finding the optimal cards to discard with 6 cards"
      );
    } else {
      throw new Error(
        "Cannot find best discard from " + hand.length + " cards"
      );
    }
  }
}

export { CardObj, Decider, Scorer };
