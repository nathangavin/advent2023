"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const file = (0, fs_1.readFileSync)('input.txt', 'utf-8');
const lines = file.split('\n');
let wordMap = new Map();
wordMap.set('o', 'one');
wordMap.set('t', new Map([['w', 'two'], ['h', 'three']]));
wordMap.set('f', new Map([['o', 'four'], ['i', 'five']]));
wordMap.set('s', new Map([['i', 'six'], ['e', 'seven']]));
wordMap.set('e', 'eight');
wordMap.set('n', 'nine');
let valueMap = new Map();
valueMap.set('one', 1);
valueMap.set('two', 2);
valueMap.set('three', 3);
valueMap.set('four', 4);
valueMap.set('five', 5);
valueMap.set('six', 6);
valueMap.set('seven', 7);
valueMap.set('eight', 8);
valueMap.set('nine', 9);
let total = 0;
for (const line of lines) {
    let first = -1;
    let last = -1;
    console.log(line);
    if (line.trim().length > 0) {
        for (let i = 0; i < line.length; i++) {
            let cand = +line[i];
            if (!isNaN(cand)) {
                if (first == -1)
                    first = cand;
                last = cand;
            }
            else {
                if (wordMap.has(line[i])) {
                    let possibility = wordMap.get(line[i]);
                    if (typeof possibility == 'string') {
                        let isNum = true;
                        for (let j = 1; j < possibility.length; j++) {
                            if (possibility[j] != line[i + j]) {
                                isNum = false;
                                break;
                            }
                        }
                        if (isNum) {
                            if (valueMap.has(possibility)) {
                                const toAdd = valueMap.get(possibility);
                                if (typeof toAdd == 'number') {
                                    if (first == -1)
                                        first = toAdd;
                                    last = toAdd;
                                }
                            }
                        }
                    }
                    else if (typeof possibility == 'object') {
                        if (possibility.has(line[i + 1])) {
                            let newPoss = possibility.get(line[i + 1]);
                            if (typeof newPoss == 'string') {
                                let isNum = true;
                                for (let j = 2; j < newPoss.length; j++) {
                                    if (newPoss[j] != line[i + j]) {
                                        isNum = false;
                                        break;
                                    }
                                }
                                if (isNum) {
                                    if (valueMap.has(newPoss)) {
                                        const toAdd = valueMap.get(newPoss);
                                        if (typeof toAdd == 'number') {
                                            if (first == -1)
                                                first = toAdd;
                                            last = toAdd;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (first > -1 && last > -1) {
        const toAdd = (first * 10) + last;
        console.log(toAdd);
        total += toAdd;
    }
}
console.log(total);
