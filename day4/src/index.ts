
import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let cardCopies = new Map<number, number>();

for (const line of lines) {
    if (line.trim().length == 0) continue;
    let matches = 0;

    let winningSet = new Set<number>();

    let [first, second] = line.split('|');
    let [cardInfo, winningNumsStr] = first.split(':');
    
    let [_, cardIdStr] = cardInfo
                            .trim()
                            .replace('   ', ' ')
                            .replace('  ', ' ')
                            .split(' ');
    let cardId = Number.parseInt(cardIdStr);
    if (typeof cardId == 'number' && !isNaN(cardId) && !cardCopies.has(cardId)) {
        cardCopies.set(cardId, 1);
    } 
    
    let winningNums = winningNumsStr.trim().split(' ');

    for (const numStr of winningNums) {
        let num = Number.parseInt(numStr);
        if (typeof num == 'number' && !isNaN(num)) {
            winningSet.add(num);
        }
    }
    let candidates = second.trim().split(' ');

    for (const candidate of candidates) {
        let candNum = Number.parseInt(candidate);
        if (typeof candNum == 'number' && !isNaN(candNum)) {
            if (winningSet.has(candNum)){
                matches++;
            } 
        }
    }

    if (matches > 0) {
        let numCopies = cardCopies.get(cardId);
        if (typeof numCopies == 'number' && !isNaN(numCopies)) {
            for (let i = cardId + 1; i <= cardId + matches; i++) {
                if (!cardCopies.has(i)) {
                    cardCopies.set(i, 1 + numCopies);
                } else {
                    let cardAmount = cardCopies.get(i);
                    if (typeof cardAmount == 'number' && !isNaN(cardAmount)) {
                        cardCopies.set(i, cardAmount + numCopies);
                    } 
                }
            }
        } 
    }
}

let numCards = 0;
for (const [_, value] of cardCopies) {
    numCards += value;
}

console.log(numCards);

