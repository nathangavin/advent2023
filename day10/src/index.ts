// https://adventofcode.com/2023/day/10

import { readFileSync } from 'fs';

type Plan = string[][];

type Point = readonly [number, number]; // y, x

type Direction = 'top' | 'down' | 'left' | 'right';

type Position = {
  point: Point;
  direction: Direction;
};

const solution = solve(readLines(`input.txt`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.split('\n');
}

function solve(inputLines: string[]) {
  const plan = inputLines.map((line) => line.split(''));
  // display(plan)

  return {
    part1: solvePart1(plan),
    part2: solvePart2(plan),
  };
}

function solvePart1(plan: Plan) {
  const startingPoint = getStartingPoint(plan);

  let currentPositions = getStartingPositions(plan, startingPoint);
  if (currentPositions.length !== 2) {
    throw 'there should be 2 starting positions';
  }

  let stepsCount = 1;

  while (!areEqual(currentPositions[0].point, currentPositions[1].point)) {
    currentPositions = currentPositions.map((position) =>
      getNextPosition(getVal(plan, position.point), position)
    );
    stepsCount++;
  }

  return stepsCount;
}

function display(plan: Plan) {
  console.log(plan.map((x) => x.join('')).join('\n'));
}

function getStartingPoint(plan: Plan): [number, number] {
  for (let y = 0; y < plan.length; y++) {
    for (let x = 0; x < plan[y].length; x++) {
      if (plan[y][x] === 'S') {
        return [y, x];
      }
    }
  }
  throw 'no starting point';
}

function getNextPosition(val: string, position: Position): Position {
  const { direction, point } = position;

  if (['-', '|'].includes(val)) {
    return newPosition(direction, point);
  }

  if (direction === 'top') {
    if (val === 'F') {
      return newPosition('right', point);
    }
    if (val === '7') {
      return newPosition('left', point);
    }
  }

  if (direction === 'down') {
    if (val === 'L') {
      return newPosition('right', point);
    }
    if (val === 'J') {
      return newPosition('left', point);
    }
  }

  if (direction === 'right') {
    if (val === 'J') {
      return newPosition('top', point);
    }
    if (val === '7') {
      return newPosition('down', point);
    }
  }

  if (direction === 'left') {
    if (val === 'F') {
      return newPosition('down', point);
    }
    if (val === 'L') {
      return newPosition('top', point);
    }
  }

  throw `unhandled next position (direction: ${direction}, val: ${val})`;
}

function getStartingPositions(plan: Plan, startingPoint: Point): Position[] {
  const positions: Position[] = [];
  const topPoint = top(startingPoint);
  const bottomPoint = down(startingPoint);
  const rightPoint = right(startingPoint);
  const leftPoint = left(startingPoint);

  if (
    startingPoint[0] > 0 &&
    ['|', 'F', '7'].includes(getVal(plan, topPoint))
  ) {
    positions.push({
      direction: 'top',
      point: topPoint,
    });
  }

  if (
    startingPoint[0] <= plan.length - 1 &&
    ['|', 'L', 'J'].includes(getVal(plan, bottomPoint))
  ) {
    positions.push({
      direction: 'down',
      point: bottomPoint,
    });
  }

  if (
    startingPoint[1] <= plan[0].length - 1 &&
    ['-', '7', 'J'].includes(getVal(plan, rightPoint))
  ) {
    positions.push({
      direction: 'right',
      point: rightPoint,
    });
  }

  if (
    startingPoint[1] > 0 &&
    ['-', 'F', 'L'].includes(getVal(plan, leftPoint))
  ) {
    positions.push({
      direction: 'left',
      point: leftPoint,
    });
  }

  return positions;
}

function getVal(plan: string[][], [y, x]: Point) {
  return plan[y][x];
}

function newPosition(direction: Direction, point: Point): Position {
  return {
    direction,
    point: pointByDirection(direction, point),
  };
}

function pointByDirection(direction: Direction, point: Point): Point {
  return { top, down, right, left }[direction](point);
}

function top([y, x]: Point): Point {
  return [y - 1, x];
}

function down([y, x]: Point): Point {
  return [y + 1, x];
}

function right([y, x]: Point): Point {
  return [y, x + 1];
}

function left([y, x]: Point): Point {
  return [y, x - 1];
}

function areEqual([ya, xa]: Point, [yb, xb]: Point) {
  return ya === yb && xa === xb;
}

/**
 * Pick's theorem (https://en.wikipedia.org/wiki/Pick%27s_theorem)
 * loopArea = interiorPointsCount + (boundaryPointsCount / 2) - 1
 *
 * Part 2 answer is interiorPointsCount
 * transforming Pick's formula:
 * interiorPointsCount = loopArea - (boundaryPointsCount / 2) + 1
 *
 * boundaryPointsCount is length of loop (practically part1 answer * 2)
 *
 * loopArea can by calculated using Shoelace formula (https://en.wikipedia.org/wiki/Shoelace_formula):
 * vertices = (x1, y1) (x2, y2) (x3, y3) ...
 * 2 * loopArea = x1 * y2 - y1 * x2 + x2 * y3 - x3 * y2 + ...
 * loopArea = result / 2
 */
function solvePart2(plan: Plan) {
  // boundaryPointsCount == part1Answer * 2
  const { vertices, boundaryPointsCount } = getLoopData(plan);
  const loopArea = getAreaUsingShoelaceFormula(vertices);

  // interiorPointsCount
  return loopArea - boundaryPointsCount / 2 + 1;
}

function getLoopData(plan: Plan): {
  vertices: Point[];
  boundaryPointsCount: number;
} {
  const startingPoint = getStartingPoint(plan);
  const vertices: Point[] = [startingPoint];

  let boundaryPointsCount = 1;
  let currentPosition = getStartingPositions(plan, startingPoint)[0];

  while (!areEqual(currentPosition.point, startingPoint)) {
    const val = getVal(plan, currentPosition.point);
    if (['F', '7', 'L', 'J'].includes(val)) {
      vertices.push(currentPosition.point);
    }
    currentPosition = getNextPosition(val, currentPosition);
    boundaryPointsCount++;
  }

  return { vertices, boundaryPointsCount };
}

function getAreaUsingShoelaceFormula(vertices: Point[]): number {
  let area = 0;

  for (let i = 0; i < vertices.length; i++) {
    const nextIndex = (i + 1) % vertices.length;
    const [currentY, currentX] = vertices[i];
    const [nextY, nextX] = vertices[nextIndex];
    area += currentX * nextY - currentY * nextX;
  }

  area = Math.abs(area) / 2;

  return area;
}





/*
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
let filledOutGrid : number[][] = [];

let startPos : [number,number] = [-1,-1];
for (const line of lines) {
    if (line.trim().length == 0) continue;

    let row = line.split('');
    if (startPos[0] == -1 && line.includes('S')) {
        let startRow = grid.length;
        let startCol = row.indexOf('S');
        startPos = [startRow, startCol];
    }
    let filledOutRow = new Array(row.length);
    filledOutRow.fill(0);
    filledOutGrid.push(filledOutRow);
    grid.push(row);
}

let loop : string[] = [];
let loopCoords : [number,number][] = [];

let foundS = false;
let currentPos : [number, number] = startPos;
let previousPos : [number,number] = [-1,-1];

while (!foundS) {
    let currentPipe = grid[currentPos[0]][currentPos[1]];
    
    let positions : [number, number][] = [];
    
    positions.push([currentPos[0] - 1,currentPos[1]]); // UP
    positions.push([currentPos[0],currentPos[1] + 1]); // RIGHT
    positions.push([currentPos[0] + 1,currentPos[1]]); // DOWN
    positions.push([currentPos[0],currentPos[1] - 1]); // LEFT
    for (let i = 0; i < positions.length; i++) {
        let position = positions[i];
        if (position[0] == previousPos[0] && position[1] == previousPos[1]) {
            continue;
        }
        if (position[0] < 0 || position[0] > grid.length - 1) continue;
        if (position[1] < 0 || position[1] > grid[0].length - 1) continue;
        
        let potentialPipe = grid[position[0]][position[1]];
        if (isValidDirection(potentialPipe,currentPipe, i)) {
            //filledOutGrid[currentPos[0]][currentPos[1]] = 1;
            previousPos = currentPos;
            currentPos = position;
            break;    
        }
    }

    let pipe = grid[currentPos[0]][currentPos[1]];
    if (pipe == 'S') {
        foundS = true;
        loopCoords.push(previousPos);
    } else {
        loopCoords.push(previousPos);
        loop.push(pipe);
    }
}

let stringGrid = '';
for (const row of filledOutGrid) {
    for (const cell of row) {
        stringGrid += cell;
    }
    stringGrid += '\n';
}
console.log(stringGrid);

function isValidDirection(pipe: string, currentPipe: string, dir: Direction) : boolean {
    let allowedDirections = pipeDirections.get(currentPipe);
    if (Array.isArray(allowedDirections)) {
        if (allowedDirections.includes(dir)) {
            let allowedPipes = validPipes.get(dir);
            if (Array.isArray(allowedPipes)) {
                return allowedPipes.includes(pipe);
            }
        } else {
            return false;
        }
    }
    return false;
}

let leftRightMap = new Map<string, [[number,number], [number,number]]>();

leftRightMap.set('-1,0', [[0,-1], [0,1]]);
leftRightMap.set('0,1', [[-1,0], [1,0]]);
leftRightMap.set('1,0', [[0,1], [0,-1]]);
leftRightMap.set('0,-1', [[1,0], [-1,0]]);

for (let i = 0; i < loopCoords.length; i++) {
    let coord = loopCoords[i];
    let nextCoord = (i == loopCoords.length - 1) ? 
                        loopCoords[0] 
                        : loopCoords[i + 1];
    
    let dir : [number,number] = [coord[0] - nextCoord[0], coord[1] - nextCoord[1]];
    let leftRight = leftRightMap.get(dir.join(','));
    console.log(leftRight);
    if (Array.isArray(leftRight)) {
        console.log(leftRight);
        let left = [coord[0] + leftRight[0][0], coord[1] + leftRight[0][1]];
        let right = [coord[0] + leftRight[1][0], coord[1] + leftRight[1][1]];

        if (left[0] >= 0 && left[0] < filledOutGrid.length) {
            if (left[1] >= 0 && left[1] < filledOutGrid[0].length) {
                if (filledOutGrid[left[0]][left[1]] != 1) {
                    filledOutGrid[left[0]][left[1]] = 2;
                }
            }
        }
        filledOutGrid[coord[0]][coord[1]] = 1;
        if (right[0] >= 0 && right[0] < filledOutGrid.length) {
            if (right[1] >= 0 && right[1] < filledOutGrid[0].length) {
                if (filledOutGrid[right[0]][right[1]] != 1) {
                    filledOutGrid[right[0]][right[1]] = 3;
                }
            }
        }
    }
}

let enclosed = 0;

for (let x = 0; x < 100; x++) {
    for (let row = 0; row < filledOutGrid.length; row++) {
        for (let col = 0; col < filledOutGrid[row].length; col++) {
            if (filledOutGrid[row][col] == 0) {
                console.log(`${row},  ${col}`);
                let str2Print = '';
                let nextToInside = false;
                let nextToOutside : boolean = false;
                let rowStart = 0;
                let rowEnd = 3;
                let colStart = 0;
                let colEnd = 3;
                if (row == 0) rowStart = 1;
                if (row == filledOutGrid.length - 1) rowEnd = 2;
                if (col == 0) colStart = 1;
                if (col == filledOutGrid[0].length - 1) colEnd = 2;
                for (let i = rowStart; i < rowEnd; i++) {
                    for (let j = colStart; j < colEnd; j++) {
                        str2Print += filledOutGrid[row + i - 1][col + j - 1] + ' ';
                        if (filledOutGrid[row + i - 1][col + j - 1] == 3) {
                            nextToInside = true;
                        } else if (filledOutGrid[row + i - 1][col + j - 1] == 2) {
                            nextToOutside = true;
                        }
                    }
                    str2Print += '\n';
                }
                console.log(str2Print);
                if (nextToInside) {
                    filledOutGrid[row][col] = 3;
                } else if (nextToOutside) {
                    filledOutGrid[row][col] = 2;
                }
            }
        }
    }
}
for (let i = 0; i < filledOutGrid.length; i++) {
    for (let j = 0; j < filledOutGrid[0].length; j++) {
        if (filledOutGrid[i][j] == 0) {
            filledOutGrid[i][j] = 3;
        } 
    }
}

for (let i = 0; i < filledOutGrid.length; i++) {
    for (let j = 0; j < filledOutGrid[0].length; j++) {
        if (filledOutGrid[i][j] == 3) enclosed++;
    }
}

stringGrid = '';
for (const row of filledOutGrid) {
    for (const cell of row) {
        stringGrid += cell;
    }
    stringGrid += '\n';
}
console.log(stringGrid);
console.log(enclosed);
/* let enclosed = 0; for (let row = 1; row < filledOutGrid.length - 1; row++) {
    for (let col = 1; col < filledOutGrid[row].length - 1; col++) { let foundOddRoute = false;
        let foundEdge = false;
        let currentCell = filledOutGrid[row][col];
        if (currentCell == 0) {
            let rowCount = [0,0];
            let colCount = [0,0];
            let count = 0;
            for (let i = 0; i < col; i++) {
                if (filledOutGrid[row][i] == 1) count++;
            } 
            rowCount[0] = count;
            if (count == 0) foundEdge = true;
            if (count > 0 && count % 2 == 1) foundOddRoute = true;
            count = 0;
            for (let i = col + 1; i < filledOutGrid[row].length; i++) {
                if (filledOutGrid[row][i] == 1) count++;
            } 
            rowCount[1] = count;
            if (count == 0) foundEdge = true;
            if (count > 0 && count % 2 == 1) foundOddRoute = true;
            count = 0;
            for (let i = 0; i < row; i++) {
                if (filledOutGrid[i][col] == 1) count++;
            }
            colCount[0] = count;
            if (count == 0) foundEdge = true;
            if (count > 0 && count % 2 == 1) foundOddRoute = true;
            count = 0;
            for (let i = row + 1; i < filledOutGrid.length; i++) {
                if (filledOutGrid[i][col] == 1) count++;
            }
            colCount[1] = count;
            if (count == 0) foundEdge = true;
            if (count > 0 && count % 2 == 1) foundOddRoute = true;
            
            if ((rowCount[0] + rowCount[1]) % 2 == 1) {
                foundOddRoute = false;
            } 
            if ((colCount[0] + colCount[2]) % 2 == 2) {
                foundOddRoute = false;
            }
            if (!foundEdge && foundOddRoute) {
                let currentCol = col;
                while (filledOutGrid[row][currentCol] == 0) {
                    enclosed++;
                    filledOutGrid[row][currentCol] = 2;
                    currentCol++;
                }
                
                currentCol = col - 1;
                while (filledOutGrid[row][currentCol] == 0) {
                    enclosed++;
                    filledOutGrid[row][currentCol] = 2;
                    currentCol--;
                }
            }
            if (foundEdge) {
                filledOutGrid[row][col] = 3;
            }
        }
    }
}

/*
for (let x = 0; x < 10; x++) {
    for (let row = 1; row < filledOutGrid.length - 1; row++) {
        for (let col = 1; col < filledOutGrid[row].length - 1; col++) {
            if (filledOutGrid[row][col] == 2) {
                console.log(`${row},  ${col}`);
                let str2Print = '';
                let nextToOutside = false;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        str2Print += filledOutGrid[row + i - 1][col + j - 1] + ' ';
                        if (filledOutGrid[row + i - 1][col + j - 1] == 3) {
                            nextToOutside = true;
                        }
                    }
                    str2Print += '\n';
                    if (nextToOutside) break;
                }
                console.log(str2Print);
                if (nextToOutside) {
                    filledOutGrid[row][col] = 3;
                    enclosed--;
                }
            }
        }
    }
}


stringGrid = '';
for (const row of filledOutGrid) {
    for (const cell of row) {
        stringGrid += cell;
    }
    stringGrid += '\n';
}
console.log(stringGrid);


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
