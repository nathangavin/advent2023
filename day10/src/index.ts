import { Dir, readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

enum Direction {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3,
}

function reverseDir(dir : Direction) : Direction {
    switch (dir) {
        case Direction.UP: return Direction.DOWN;
        case Direction.DOWN: return Direction.UP;
        case Direction.LEFT: return Direction.RIGHT;
        case Direction.RIGHT: return Direction.LEFT;
    }
}

let validPipes = new Map<Direction, string[]>();
validPipes.set(0, ['|', 'F', '7', 'S']);
validPipes.set(1, ['J', '-', '7', 'S']);
validPipes.set(2, ['|', 'J', 'L', 'S']);
validPipes.set(3, ['-', 'F', 'L', 'S']);

let pipeDirections = new Map<string, number[]>();
pipeDirections.set('|', [0,2]);
pipeDirections.set('-', [3, 1]);
pipeDirections.set('L', [0, 1]);
pipeDirections.set('7', [3, 2]);
pipeDirections.set('F', [2, 1]);
pipeDirections.set('J', [3, 0]);
pipeDirections.set('S', [0,1,2,3]);

let grid : string[][] = [];
let startPos : [number,number] = [-1,-1];
for (const line of lines) {
    if (line.trim().length == 0) continue;

    let row = line.split('');
    if (startPos[0] == -1 && line.includes('S')) {
        let startRow = grid.length;
        let startCol = row.indexOf('S');
        startPos = [startRow, startCol];
    }
    grid.push(row);
}

let loop : string[] = [];

let foundS = false;
let currentPos : [number, number] = startPos;
let previousPos : [number,number] = [-1,-1];

while (!foundS) {
    console.log('loop start');
    let currentPipe = grid[currentPos[0]][currentPos[1]];
    console.log(`currentPos : ${currentPos} `);
    console.log(`previousPos : ${previousPos}`);
    
    let positions : [number, number][] = [];
    
    positions.push([currentPos[0] - 1,currentPos[1]]); // UP
    positions.push([currentPos[0],currentPos[1] + 1]); // RIGHT
    positions.push([currentPos[0] + 1,currentPos[1]]); // DOWN
    positions.push([currentPos[0],currentPos[1] - 1]); // LEFT
    
    console.log('starting inner loop');
    for (let i = 0; i < positions.length; i++) {
        let position = positions[i];
        if (position[0] == previousPos[0] && position[1] == previousPos[1]) {
            continue;
        }
        if (position[0] < 0 || position[0] > grid.length - 1) continue;
        if (position[1] < 0 || position[1] > grid[0].length - 1) continue;
        
        console.log(`position : ${position}`);
        let potentialPipe = grid[position[0]][position[1]];
        if (isValidDirection(potentialPipe,currentPipe, i)) {
            console.log(position);
            console.log(position == previousPos);
            console.log(potentialPipe);
            previousPos = currentPos;
            currentPos = position;
            break;    
        }
    }
    console.log('ending inner loop');

    let pipe = grid[currentPos[0]][currentPos[1]];
    if (pipe == 'S') {
        foundS = true;
    } else {
        loop.push(pipe);
    }
    console.log(loop);
}
console.log(loop);

console.log(Math.floor(loop.length / 2) + 1);

function isValidDirection(pipe: string, currentPipe: string, dir: Direction) : boolean {
    console.log('starting validation');
    console.log(`pipe : ${pipe}`);
    console.log(`currentPipe : ${currentPipe}`);
    console.log(`dir : ${dir}`);
    let allowedDirections = pipeDirections.get(currentPipe);
    if (Array.isArray(allowedDirections)) {
        console.log(`allowedDirections : ${allowedDirections}`);
        console.log(`dir : ${dir}`);
        console.log(allowedDirections.includes(dir));
        if (allowedDirections.includes(dir)) {
            let allowedPipes = validPipes.get(dir);
            console.log(`allowedPipes : ${allowedPipes}`);
            console.log(`pipe : ${pipe}`);
            if (Array.isArray(allowedPipes)) {
                console.log(allowedPipes.includes(pipe));
                return allowedPipes.includes(pipe);
            }
        } else {
            return false;
        }
    }
    return false;
}

/*
while (!foundS) {
    let isLeft = false;
    let isRight = false;
    let isUp = false;
    let isDown = false;

    

    if (currentPos[0] > 0) {
        isUp = isValidDirection(grid[currentPos[0] - 1][currentPos[1]], Direction.UP);
    } 
    if (currentPos[0] < grid.length - 1) {
        isDown = isValidDirection(grid[currentPos[0] + 1][currentPos[1]], Direction.DOWN);
    }
    if (currentPos[1] > 0) {
        isLeft = isValidDirection(grid[currentPos[0]][currentPos[1] - 1], Direction.LEFT);
    }
    if (currentPos[1] < grid[0].length - 1) {
        isRight = isValidDirection(grid[currentPos[0]][currentPos[1] + 1], Direction.RIGHT);
    }

    if (loop.length > 0) {
        switch (previousDir) {
            case Direction.UP: 
                isDown = false;
                break;
            case Direction.DOWN:
                isUp = false;
                break;
            case Direction.RIGHT:
                isLeft = false;
                break;
            case Direction.LEFT:
                isRight = false;
                break;
        }
    }

    if (isLeft) {
        currentPos = [currentPos[0],currentPos[1] - 1];
        previousDir = Direction.LEFT;
    } else if (isRight) {
        currentPos = [currentPos[0],currentPos[1] + 1];
        previousDir = Direction.RIGHT;
    } else if (isUp) {
        currentPos = [currentPos[0] - 1,currentPos[1]];
        previousDir = Direction.DOWN;
    } else if (isDown) {
        currentPos = [currentPos[0] + 1,currentPos[1]];
        previousDir = Direction.UP;
    }

    console.log(currentPos);
    console.log(previousDir);
    let nextPipe = grid[currentPos[0]][currentPos[1]];
    console.log(nextPipe);
    if (nextPipe != 'S') {
        loop.push(nextPipe);
    } else {
        foundS = true;
    }
}

console.log(loop);


function isValidDirection(pipeVal : string, dir : Direction) : boolean {
    let directions = pipeDirections.get(pipeVal);
    if (Array.isArray(directions)) {
        let invertedDir = invertDirection(dir);
        return directions.includes(invertedDir);
    }
    return false;
}
*/
