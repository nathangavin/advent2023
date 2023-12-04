import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

// find number in row
// look around number to see if there are symbols

let totalPartNumbers = 0;

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
            
            let validPart = false;
            for (let x = firstPos - 1; x <= lastPos + 1; x++) {
                if (x < 0) continue;
                if (x >= line.length) break;
                if (i > 0 && isCharSymbol(lines[i - 1][x])) {
                    console.log(`Above: row: ${i - 1}, col: ${x}, val: ${lines[i - 1][x]}`);
                    validPart = true;
                    break;
                } else if (i < lines.length - 2 && isCharSymbol(lines[i + 1][x])) {
                    console.log(`Below: row: ${i + 1}, col: ${x}, val: ${lines[i + 1][x]}`);
                    validPart = true;
                    break;
                }
            }

            if (!validPart) {
                if (firstPos > 0 && isCharSymbol(line[firstPos - 1])) {
                    console.log(`Left: row: ${i}, col: ${firstPos - 1}, val: ${line[firstPos - 1]}`);
                    validPart = true;
                } else if (lastPos < line.length - 1 && isCharSymbol(line[lastPos + 1])) {
                    console.log(`Right: row: ${i}, col: ${lastPos + 1}, val: ${line[lastPos + 1]}`);
                    validPart = true;
                }
            }

            if (validPart) {
                let partNumberStr = "";
                for (let k = firstPos; k <= lastPos; k++) {
                    partNumberStr += line[k];
                }
                let partNumber = Number.parseInt(partNumberStr);
                if (!isNaN(partNumber)) {
                    totalPartNumbers += partNumber;
                }
            }
        }
    }
}

console.log(totalPartNumbers);

function isCharNumeric(c: string) : boolean {
    return /\d/.test(c);
}

function isCharSymbol(c: string) : boolean {
    return /[^\d.]/.test(c);
}
