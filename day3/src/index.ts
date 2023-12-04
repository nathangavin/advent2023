import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let partNumberPositions : Array<Array<[number,number]>> = [];
let ratioSum = 0;

for (const line of lines) {
    if (line.trim().length == 0) continue;
    partNumberPositions.push([]);
}

for (let i = 0; i < lines.length; i++) {
    
    let line = lines[i];
    if (line.trim().length == 0) continue;

    let firstPos = -1;
    let lastPos = -1;
    for (let j = 0; j < line.length; j++) {
        let char = line[j];
        if (isCharNumeric(char)) {
            firstPos = j;
            while (isCharNumeric(line[j])) j++;
            lastPos = j - 1;
            j--;
            
            let rowFound = -1;
            let validPart = false;
            for (let x = firstPos - 1; x <= lastPos + 1; x++) {
                if (x < 0) continue;
                if (x >= line.length) break;
                if (i > 0 && isCharStar(lines[i - 1][x])) {
                    rowFound = i;
                    validPart = true;
                    break;
                } else if (i < lines.length - 2 && isCharStar(lines[i + 1][x])) {
                    rowFound = i;
                    validPart = true;
                    break;
                }
            }

            if (!validPart) {
                if (firstPos > 0 && isCharStar(line[firstPos - 1])) {
                    rowFound = i;
                    validPart = true;
                } else if (lastPos < line.length - 1 && isCharStar(line[lastPos + 1])) {
                    rowFound = i;
                    validPart = true;
                }
            }

            if (validPart) {
                console.log(`row: ${i}, first: ${firstPos}, last: ${lastPos}`);
                partNumberPositions[rowFound].push([firstPos,lastPos]);
            }
        }
    }
}

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim().length == 0) continue;

    for (let j = 0; j < line.length; j++) {
        let char = line[j];

        if (isCharStar(char)) {
            let adjacentNumberPositions : Array<[number, number, number]> = [];
            if (i > 0 && i < lines.length - 2) {
                for (let row = i - 1; row <= i + 1; row++) {
                    for (const pair of partNumberPositions[row]) { 
                        let isNear = false;
                        for (let col = j - 1; col <= j + 1; col++) {
                            if (pair[0] <= col && pair[1] >= col) {
                                isNear = true;
                                break;
                            }
                        }
                        if (isNear) {
                            adjacentNumberPositions.push([row, pair[0], pair[1]]);
                        }
                    }
                }
            }

            if (adjacentNumberPositions.length == 2) {
                let ratio = 1;
                
                for (const pos of adjacentNumberPositions) {
                    let partNumberStr = "";
                    let [row, firstPos, lastPos] = pos;
                    if (typeof row == 'number' && !isNaN(row) &&
                        typeof firstPos == 'number' && !isNaN(firstPos) &&
                        typeof lastPos == 'number' && !isNaN(lastPos)) {
                            for (let k = firstPos; k <= lastPos; k++) {
                                partNumberStr += lines[pos[0]][k];
                            }
                            let partNumber = Number.parseInt(partNumberStr);
                            if (!isNaN(partNumber)) {
                                ratio *= partNumber;
                            }
                    }
                }

                ratioSum += ratio;
            }
        }
    }
}

console.log(ratioSum);

function isCharNumeric(c: string) : boolean {
    return /\d/.test(c);
}

function isCharSymbol(c: string) : boolean {
    return /[^\d.]/.test(c);
}

function isCharStar(c: string) : boolean {
    return /[*]/.test(c);
}
