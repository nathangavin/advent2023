import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let colEmpty : boolean[] = [];
let rowEmpty : boolean[] = [];
let galaxyPositions : [number,number][] = [];
for (const line of lines) {
    if (line.trim().length == 0) continue;
    
    let lineEmpty = true;
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (lineEmpty && char != '.') {
            lineEmpty = false;
        }
        if (colEmpty.length >= i + 1) {
            if (colEmpty[i]) colEmpty[i] = char == '.';
        } else {
            colEmpty.push(char == '.');
        }
        if (char == '#') {
            galaxyPositions.push([rowEmpty.length,i]);
        }
    }
    rowEmpty.push(lineEmpty);
}

let numExtraRows : number[] = [];
let numExtraCols : number[] = [];

let extraRows = 0;
let extraCols = 0;
for (let i = 0; i < colEmpty.length; i++) {
    if (colEmpty[i]) {
        extraCols++;
    }
    numExtraCols[i] = extraCols;
}
for (let i = 0; i < rowEmpty.length; i++) {
    if (rowEmpty[i]) {
        extraRows++;
    }
    numExtraRows[i] = extraRows;
}

for (const galPos of galaxyPositions) {
    galPos[0] = galPos[0] + numExtraRows[galPos[0]];
    galPos[1] = galPos[1] + numExtraCols[galPos[1]];
}


let sumShortestPaths = 0;
while (galaxyPositions.length > 0) {
    let gal1 = galaxyPositions.shift();

    if (Array.isArray(gal1)) {
        for (let i = 0; i < galaxyPositions.length; i++) {
            let gali = galaxyPositions[i];
            let dist = Math.abs(gal1[0] - gali[0]) + Math.abs(gal1[1] - gali[1]);
            sumShortestPaths += dist;
        }
    }
}

console.log(sumShortestPaths);
