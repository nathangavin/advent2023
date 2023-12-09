import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let histories = new Array<Array<number>>();

for (const line of lines) {
    if (line.trim().length == 0) continue;

    let history : Array<number> = line.split(' ').map(s => {
        return Number.parseInt(s);
    });

    histories.push(history);
}

console.log(histories);
let total = 0;
for (const history of histories) {
    
    let lasts = new Array<number>();

    let calculating = true;
    
    let differences = history;
    while (calculating) {
        lasts.push(differences[differences.length - 1]);
        let allZeros = true; 
        let newDifferences = [];
        for (let i = 1; i < differences.length; i++) {
            let newDiff = differences[i] - differences[i - 1];
            if (newDiff != 0) allZeros = false;
            newDifferences.push(newDiff);
        }
        differences = newDifferences;
        if (allZeros) {
            calculating = false;
        }
    }

    for (const last of lasts) {
        total += last;
    }
}

console.log(total);

