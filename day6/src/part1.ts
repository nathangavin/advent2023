import { readFileSync } from 'fs';


const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let [timeLine, distanceLine] = [lines[0], lines[1]];

let [timeName, timeNumbersStr] = timeLine.split(':');
let [distanceName, distanceNumbersStr] = distanceLine.split(':');

let timeNumbers = timeNumbersStr
                            .trim()
                            .split(/[ ]+/)
                            .map(s => {
                                return Number.parseInt(s);
                            });

let distanceNumbers = distanceNumbersStr
                                    .trim()
                                    .split(/[ ]+/)
                                    .map(s => {
                                        return Number.parseInt(s);
                                    });

let waysToWin = [];
for (let i = 0; i < timeNumbers.length; i++) {
    let numberOfWins = 0;

    let time = timeNumbers[i];
    let dist = distanceNumbers[i];
    for (let timeHeld = time - 1; timeHeld > 0; timeHeld--) {
        let distanceTravelled = (time - timeHeld) * timeHeld;
        if (distanceTravelled > dist) {
            numberOfWins++;
        }
    }
    waysToWin.push(numberOfWins);
}

let total = 1;
for (const num of waysToWin) {
    total *= num;
} 

console.log(total);
