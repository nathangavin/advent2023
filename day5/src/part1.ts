
import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let linePos = 0;


let [_, seedLines] = lines[linePos].split(':');

let seeds = seedLines.trim().split(' ').map(s => {
    return Number.parseInt(s);
});

linePos += 2;

let transformations = [];

for (let i = 0; i < 7; i++) {
    let transformation = new Map<number, [number, number]>();
    while (lines[linePos].trim().length > 0) { 
        
        let [destination, origin, length] = lines[linePos].split(' ').map(s => {
            return Number.parseInt(s);
        });
        
        if (!isNaN(destination)) {
            transformation.set(origin, [destination,length]);
        }

        linePos++;
    }
    let sortedTransformation = new Map([...transformation].sort());

    transformations.push(sortedTransformation);
    
    linePos++;
}

let smallestDest = Number.MAX_SAFE_INTEGER;

for (const seed of seeds) {
    let workingNumber = seed;
    for (const transformation of transformations) {
        workingNumber = transformNumber(workingNumber, transformation);
    }
    smallestDest = workingNumber < smallestDest ? workingNumber : smallestDest;
}

console.log(smallestDest);

function transformNumber(n : number, t : Map<number, [number, number]>) : number {
    
    let returnable = n;
    
    let keys = Array.from(t.keys());

    if (n < keys[0]) {
        return n;
    }
    for (let i = 0; i < keys.length; i++) {
        let mapping = t.get(keys[i]);
        if (Array.isArray(mapping) && mapping.length == 2) {
            let [destination, length] = mapping;
            if (n >= keys[i] && n < keys[i] + length) {
                let diff = destination - keys[i];
                returnable += diff;
                break;
            }
        }
    }

    return returnable;
}

