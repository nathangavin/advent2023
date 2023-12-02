import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');

const lines = file.split('\n');


let max = new Map<string, number>();
max.set('red', 12);
max.set('green', 13);
max.set('blue', 14);

let totalIds = 0;

for (const line of lines) {
    if (line.trim().length == 0) continue;
    let [game, results] = line.split(':');
    let [_, id] = game.split(' ');
    
    let turns = results.split(';');
    
    let isPossible = true;

    for (const turn of turns) {
        let cubeTypes = turn.split(',');

        for (const cubeType of cubeTypes) {
            let [amount, type] = cubeType.trim().split(' ');
            if (max.has(type)) {
                let maxC = max.get(type);
                let numA = +amount;
                if (typeof maxC == 'number' && maxC < numA) {
                    isPossible = false;
                    break;
                }
            }
        }
        if (!isPossible) {
            break;
        }
    }

    if (isPossible) {
        totalIds += +id;
    }
}

console.log(totalIds);
