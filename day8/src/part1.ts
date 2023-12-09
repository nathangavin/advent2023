import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let elementMap = new Map<string,[string,string]>();

let instructions = lines[0];

for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim().length == 0) continue;

    line = line.replace(/[() ]/gi, '');
    let [elementName, paths] = line.trim().split('=');
    let [left, right] = paths.split(',');
    
    elementMap.set(elementName,[left, right]);
}

let steps = 0;
let searching = true;
let instructionPos = 0;
let pos = 'AAA';
let dest = 'ZZZ';
while (searching) {
   
    let directions = elementMap.get(pos);
    if (Array.isArray(directions) && directions.length == 2) {
        let instruction = instructions[instructionPos];
        instructionPos++;
        if (instructionPos >= instructions.length) instructionPos = 0;

        if (instruction == 'L') {
            pos = directions[0];
        } else {
            pos = directions[1];
        }
        steps++;
        if (pos == dest) {
            searching = false;
        }
    }
}

console.log(steps);

