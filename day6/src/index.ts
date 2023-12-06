import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let [timeLine, distanceLine] = [lines[0], lines[1]];

let [timeName, timeNumbersStr] = timeLine.split(':');
let [distanceName, distanceNumbersStr] = distanceLine.split(':');

let time = Number.parseInt(timeNumbersStr.replace(/[ ]+/gi, ''));
    
let distance = Number.parseInt(distanceNumbersStr.replace(/[ ]+/gi, ''));


let minTime = 0;

for (let timeHeld = 1; timeHeld < time; timeHeld++) {
    let distanceTravelled = (time - timeHeld) * timeHeld;
    if (distanceTravelled > distance) {
        minTime = timeHeld;
        break;
    }
}

let maxTime = time;

for (let timeHeld = time - 1; timeHeld > 0; timeHeld--) {
    let distanceTravelled = (time - timeHeld) * timeHeld;
    if (distanceTravelled > distance) {
        maxTime = timeHeld;
        break;
    }
}

console.log(minTime);
console.log(maxTime);
console.log(maxTime - minTime + 1);
