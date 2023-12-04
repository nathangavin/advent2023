
import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let totalPoints = 0;
for (const line of lines) {
    if (line.trim().length == 0) continue;
    let matches = 0;

    let winningSet = new Set<number>();

    let [first, second] = line.split('|');
    let printLine = first + ' | ';
    let [_, winningNumsStr] = first.split(':');

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
                printLine += 'T ';
                matches++;
            } else {
                printLine += 'F ';
            }
        }
    }

    printLine += ' - ' + candidates.length;

    if (matches > 0) {
        totalPoints += 2 ** (matches - 1);
    }
}

console.log(totalPoints);
