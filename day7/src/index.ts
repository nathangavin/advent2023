import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

enum HandType {
    HIGHCARD = 1,
    ONEPAIR = 2,
    TWOPAIR = 3,
    THREEKIND = 4,
    FULLHOUSE = 5,
    FOURKIND = 6,
    FIVEKIND = 7,
    ERROR = -1
};

let cardValues = new Map<string,number>([
    ['2', 2],
    ['3', 3],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9],
    ['T', 10],
    ['J', 11],
    ['Q', 12],
    ['K', 13],
    ['A', 14]
]);


let handGroups = new Map<HandType, Array<[string, number]>>();

for (const line of lines) {
    if (line.trim().length == 0) continue;
    let [hand, betStr] = line.trim().split(' ');
    let bet = Number.parseInt(betStr);
    if (isNaN(bet)) {
    }
    let handType : HandType = calculateHandType(hand);
    if (handGroups.has(handType)) {
        let matchingHands = handGroups.get(handType);
        if (Array.isArray(matchingHands)) {
            matchingHands.push([hand, bet]);
            handGroups.set(handType, matchingHands);
        }
    } else {
        handGroups.set(handType, [[hand, bet]]);
    }
}

console.log(handGroups);

let rank = 1;
let winnings = 0;

for (const type of Array.from(handGroups.keys()).sort()) {
    if (handGroups.has(type)) {
        let hands = handGroups.get(type);
        if (Array.isArray(hands) && hands.length > 0) {
            if (hands.length == 1) {
                winnings += hands[0][1] * rank;
                rank++;
            } else {
                hands.sort((a,b) => {
                    return sortHands(a[0],b[0]);
                });
                console.log(type);
                console.log(hands);
                for (const hand of hands) {
                    winnings += hand[1] * rank;
                    rank++;
                }
            }
        }
    }
}

console.log(winnings);

function sortHands(hand1 : string, hand2 : string) : number {
    let pos = 0;
    
    while (pos < hand1.length) {
        let card1Val = cardValues.get(hand1[pos]);
        let card2Val = cardValues.get(hand2[pos]);
        if (typeof card1Val == 'number' && !isNaN(card1Val) &&
            typeof card2Val == 'number' && !isNaN(card2Val)) {
                if (card1Val < card2Val) {
                    return -1;
                } else if (card2Val < card1Val) {
                    return 1;
                } else {
                    pos++;
                }
        }
    }
    return 0;
}

function calculateHandType(hand : string) : HandType {
    
    let cardsPresent = new Map<string, number>();

    for (let char of hand) {
        if (cardsPresent.has(char)) {
            let numCards = cardsPresent.get(char);
            if (typeof numCards == 'number' && !isNaN(numCards)) {
                cardsPresent.set(char, numCards + 1);
            }
        } else {
            cardsPresent.set(char, 1);
        }
    }
    console.log(cardsPresent);
    let cards = Array.from(cardsPresent.keys());
    let max = 0;
    switch (cards.length) {
        case 1:
            return HandType.FIVEKIND;
        case 2:
            // FOURKIND or FULLHOUSE
            max = 0;
            for (const card of cards) {
                let count = cardsPresent.get(card);
                if (typeof count == 'number' && !isNaN(count)) {
                    if (count > max) max = count;
                }
            }

            if (max == 4) return HandType.FOURKIND;
            if (max == 3) return HandType.FULLHOUSE;
            return HandType.ERROR;
        case 3:
            // THREEKIND or TWOPAIR
            max = 0;
            for (const card of cards) {
                let count = cardsPresent.get(card);
                if (typeof count == 'number' && !isNaN(count)) {
                    if (count > max) max = count;
                }
            }

            if (max == 3) return HandType.THREEKIND;
            if (max == 2) return HandType.TWOPAIR;
            return HandType.ERROR;
        case 4:
            return HandType.ONEPAIR;
        case 5:
            return HandType.HIGHCARD;
        default:
            return HandType.ERROR;
    }
}
