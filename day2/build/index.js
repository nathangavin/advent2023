"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const file = (0, fs_1.readFileSync)('input.txt', 'utf-8');
const lines = file.split('\n');
let maxMap = new Map();
maxMap.set('red', 0);
maxMap.set('green', 0);
maxMap.set('blue', 0);
let totalPowers = 0;
for (const line of lines) {
    if (line.trim().length == 0)
        continue;
    let [_, results] = line.split(':');
    maxMap.set('red', 0);
    maxMap.set('green', 0);
    maxMap.set('blue', 0);
    let turns = results.split(';');
    for (const turn of turns) {
        let cubeTypes = turn.split(',');
        for (const cubeType of cubeTypes) {
            let [amount, type] = cubeType.trim().split(' ');
            if (maxMap.has(type)) {
                let currentMax = maxMap.get(type);
                if (typeof currentMax == 'number' && +amount > currentMax) {
                    maxMap.set(type, +amount);
                }
            }
        }
    }
    let maxR = maxMap.get('red');
    let maxG = maxMap.get('green');
    let maxB = maxMap.get('blue');
    if (typeof maxR == 'number' &&
        typeof maxG == 'number' &&
        typeof maxB == 'number') {
        totalPowers += maxR * maxG * maxB;
    }
}
console.log(totalPowers);
