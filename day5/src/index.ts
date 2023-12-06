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
let ranges : Array<[number,number]> = [];

for (let i = 0; i < seeds.length; i += 2) {
    ranges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
}

for (let i = 0; i < transformations.length; i++) {
    
    let nextRanges : Array<[number,number]> = [];
    for (const range of ranges) {
        nextRanges.push(...transformRange(range[0], range[1], transformations[i]));
    }
    ranges = nextRanges;
    console.log(ranges);
}
let smallest = ranges.map(a => a[0]);

console.log(Math.min(...smallest));
function transformRange(first : number, 
                        last : number, 
                        t : Map<number, [number, number]>) : Array<[number, number]> {
    
    let keys = Array.from(t.keys());
    
    let returnable = new Array<[number,number]>();

    let rangesToProcess = new Array<[number, number]>();
    rangesToProcess.push([first, last]);
    console.log(rangesToProcess);
    let tRanges = new Array<[number,number,number]>();
    for (let i = 0; i < keys.length; i++) {
        let mapping = t.get(keys[i]);
        if (Array.isArray(mapping)) {
            let [destination, length] = mapping;
            let start = keys[i];
            let end = start + length - 1;
            let diff = destination - start;
            tRanges.push([start, end, diff]);
        }
    }
    while (rangesToProcess.length > 0) {
        console.log('start');
        console.log(t);
        let range = rangesToProcess.pop();
        if (Array.isArray(range)) {
            let [f,l] = range;

            console.log('tRanges');
            console.log(tRanges);

            let processed = false;

            for (const tRange of tRanges) {
                let [start, end, diff] = tRange;
                console.log('s2');
                console.log(range);
                console.log(tRange);
                console.log('e2');

                if (f < start) {
                    if (l < start) {
                        console.log(1);
                        continue;
                    } else if (l >= start && l < end) {
                        console.log(2);
                        rangesToProcess.push([f, start - 1]);
                        returnable.push([start + diff, l + diff]);
                        processed = true;
                        break;
                    } else if (l > end) {
                        console.log(3);
                        rangesToProcess.push([f, start - 1]);
                        rangesToProcess.push([end + 1, l]);
                        returnable.push([start + diff, end + diff]);
                        processed = true;
                        break;
                    }
                } else if (f >= start && l <= end) {
                    console.log(4);
                    returnable.push([f + diff, l + diff]);
                    processed = true;
                    break;
                } else if (f >= start && f <= end && l > end) {
                    console.log(5);
                    returnable.push([f + diff, end + diff]);
                    rangesToProcess.push([end + 1, l]);
                    processed = true;
                    break;
                } else if (f > end) {
                    console.log(6);
                    continue;
                } else {
                    console.log(7);
                    continue;
                }
            }

            if (!processed) {
                returnable.push([f, l]);
            }
        }
        console.log('ranges');
        console.log(rangesToProcess);
        console.log('end');
    }

    return returnable;
}

