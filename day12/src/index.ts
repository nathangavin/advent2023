import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let totalArrangements = 0;
for (const line of lines) {
    if (line.trim().length == 0) continue;

    let [row, config] = line.split(' ');
    let brokenList = config.split(',').map(s => Number.parseInt(s));
    let options : string[] = ['.'];

    for (const char of row) {
        if (char == '.') {
            for (let i = 0; i < options.length; i++) {
                if (options[i][options[i].length - 1] != '.') {
                    options[i] += '.';
                }
            }
        } else if (char == '#') {
            for (let i = 0; i < options.length; i++) {
                options[i] += '#';
            }
        } else if (char == '?') {
            let newOptions : string[] = [];
            for (let option of options) {
                newOptions.push(option + '.');
                newOptions.push(option + '#');
            }
            options = newOptions;
        }
    }

    for (let i = 0; i < options.length; i++) {
        options[i] += '.';
    }
    console.log(row);
    let requiredStrings : string[] = [];
    let totalBroken = 0; 
    for (const num of brokenList) {
        requiredStrings.push('.' + new Array(num).fill('#').reduce((p,n) => p + n) + '.');
        totalBroken += num;
    }
    
    for (let option of options) {
        let numBroken = (option.match(/#/g) || []).length;
        let isValidOption = true;
        for (const r of requiredStrings) {
            let i = option.indexOf(r);
            if (i == -1) {
                isValidOption = false;
                break;
            } else {
                option = option.substring(i + r.length - 1);
            }
        }
        if (isValidOption && numBroken == totalBroken) {
            totalArrangements++;
        }
    }
}

console.log(totalArrangements);
