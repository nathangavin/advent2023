import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let elementMap = new Map<string,[string,string]>();

let startingNodes = new Set<string>();
let destinationNodes = new Set<string>();
let instructions = lines[0];

for (let i = 1; i < lines.length; i++) {
    let line = lines[i];
    if (line.trim().length == 0) continue;

    line = line.replace(/[() ]/gi, '');
    let [elementName, paths] = line.trim().split('=');
    let [left, right] = paths.split(',');
    
    if (elementName[2] == 'A') startingNodes.add(elementName);
    if (elementName[2] == 'Z') destinationNodes.add(elementName);
    elementMap.set(elementName,[left, right]);
}

let xCosts : Array<Array<number>>= [];

for (const node of startingNodes) {
    let steps = 0;
    let searching = true;
    let instructionPos = 0;
    let pos = node;
    let costs = new Array<number>();
    let goalsReached = new Set<string>();
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
            if (pos.includes('Z')) {
                if (goalsReached.has(pos)) {
                    searching = false;
                } else {
                    costs.push(steps);
                    goalsReached.add(pos);
                }
            }
        }
    }
    xCosts.push(costs);
}

let costs = xCosts.map(n => n[0]);

function hcf(a: number,b: number) : number {
    let mod = 0;
    if (a > b) {
        mod = a % b;
        if (mod == 0) {
            return b;
        } else {
            return hcf(b, mod);
        }
    } else {
        mod = b % a;
        if (mod == 0) {
            return a;
        } else {
            return hcf(a, mod);
        }
    } 
}

function lcm(a: number, b: number) : number {
    let gcd = hcf(a,b);

    if (a > b) {
        return b * (a / gcd);
    } else {
        return a * (b / gcd);
    }
}

let costLCM = costs[0];
for (let i = 1; i < costs.length; i++) {
    costLCM = lcm(costLCM, costs[i]);
}

console.log(costLCM);

