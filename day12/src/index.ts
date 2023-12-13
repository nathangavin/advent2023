import { readFileSync } from 'fs';

const file = readFileSync('input.txt', 'utf-8');
//const file = readFileSync('test.txt', 'utf-8');

const lines = file.split('\n');

let totalArrangements = 0;
for (const line of lines) {
    if (line.trim().length == 0) continue;

    let [row, config] = line.split(' ');
    let brokenList = config.split(',').map(s => Number.parseInt(s));

    let numOfBrokenAtEndOfRow : number = 0;
    for (let i = row.length - 1; i >= 0; i--) {
        if (row[i] == '#') {
            numOfBrokenAtEndOfRow++;
        } else {
            break;
        }
    }
    
    let rows : [string,string] = [
        row,
        '?' + row,
    ];
    
    let rows2 : [string,string] = [
        row + '?',
        row
    ];

    let requiredStrings : string[] = [];

    let totalBroken = 0; 
    for (const num of brokenList) {
        requiredStrings.push(new Array(num).fill('#').reduce((p,n) => p + n) + '.');
        totalBroken += num;
    }

    let totalRequiredStrings = [...requiredStrings, ...requiredStrings];

    let options1 = getProducts(rows,numOfBrokenAtEndOfRow,brokenList);
    let options2 = getProducts(rows2,numOfBrokenAtEndOfRow,brokenList);
    
        
    console.log(options1);
    console.log(options2);
    let validStrings = new Set<string>();
    let stringsAsNumbers :number[] = [];
    
    let binMap = new Map<string,string>();
    binMap.set('.', '0');
    binMap.set('#', '1');
    for (const option11 of options1[0]) {
        let option11Binary = "";
        for (const char of option11) {
            option11Binary += binMap.get(char);
        }
        for (const option12 of options1[1]) {
            let option12Binary = "";
            for (const char of option12) {
                option12Binary += binMap.get(char);
            }
        }
    }
    for (const option21 of options2[0]) {
        let option21Binary = "";
        for (const char of option21) {
            option21Binary += binMap.get(char);
        }
        for (const option22 of options2[0]) {
            let option22Binary = "";
            for (const char of option22) {
                option22Binary += binMap.get(char);
            }
        }
    }

    console.log(stringsAsNumbers.length);
    /*
    let rowOptions : [string[], string[]] = [[], []];
    for (let j = 0; j < rows.length; j++) {
        let rowSeg = rows[j];
        let options : string[] = [];
        if (j > 0) {
            if (numOfBrokenAtEndOfRow + 1 > brokenList[0]) {
                rowSeg = rowSeg.replace("?", ".");
            }
        }
        for (const char of rowSeg) {
            if (char == '.') {
                if (options.length == 0) {
                    options.push('.');
                } else {
                    for (let i = 0; i < options.length; i++) {
                        options[i] += '.';
                    }
                }
            } else if (char == '#') {
                if (options.length == 0) {
                    options.push('#');
                } else {
                    for (let i = 0; i < options.length; i++) {
                        options[i] += '#';
                    }
                }
            } else if (char == '?') {
                if (options.length == 0) {
                    options.push('.');
                    options.push('#');
                } else {
                    let newOptions : string[] = [];
                    for (let option of options) {
                        newOptions.push(option + '.');
                        newOptions.push(option + '#');
                    }
                    options = newOptions;
                }
            }
        }

        for (let i = 0; i < options.length; i++) {
            options[i] += '.';
        }
        rowOptions[j] = options;
    }


    let requiredStrings : string[] = [];
    let totalBroken = 0; 
    for (const num of brokenList) {
        requiredStrings.push(new Array(num).fill('#').reduce((p,n) => p + n) + '.');
        totalBroken += num;
    }
    
    let cleanedRowOptions : [string[],string[]] = [[],[]];
    for (let j = 0; j < rowOptions.length; j++) {
        const options = rowOptions[j];
        let cleanedOptions : string[] = [];
        for (let i = 0; i < options.length; i++) {
            let numBroken = (options[i].match(/#/g) || []).length;
            if (numBroken == totalBroken) {
                if (options[i][options[i].length - 1] != '.') {
                    cleanedOptions.push(options[i] + '.');
                } else {
                    cleanedOptions.push(options[i]);
                }
            }
        }
        cleanedRowOptions[j] = cleanedOptions;
    }

    let filteredRowOptions : [string[], string[]] = [[], []];
    for (let j = 0; j < cleanedRowOptions.length; j++) {
        const cleanedOptions = cleanedRowOptions[j];
        for (let option of cleanedOptions) {
            let optionCopy = option.substring(0,option.length - 1);
            if (isStringValid(option, requiredStrings)) {
                filteredRowOptions[j].push(optionCopy);
            }
        }
    }

    console.log(filteredRowOptions);
    let finalOptions = [];

    for (const option1 of filteredRowOptions[0]) {
        for (const option2 of filteredRowOptions[1]) {
            let optionToAdd = option1;
            optionToAdd += option2;
            optionToAdd += option2;
            optionToAdd += option2;
            optionToAdd += option2;
            finalOptions.push(optionToAdd);
        }
    }

    console.log(finalOptions);
    console.log(finalOptions.length * finalOptions.length);
    let totalRequiredStrings = [...requiredStrings, ...requiredStrings,
                                ...requiredStrings, ...requiredStrings,
                                ...requiredStrings];
    
    let product = 1;    
    product = filteredRowOptions[0].length * (filteredRowOptions[1].length ** 4);
    console.log(product);
    let total = 0;

    for (const option of finalOptions) {
        if (isStringValid(option,totalRequiredStrings)) total++;
    }
    */
                                    
}

console.log(totalArrangements);

function isStringValid(option : string, stringsToCompare : string[]) : boolean {
    let isValidOption = true;
    for (const r of stringsToCompare) {
        let i = option.indexOf(r);
        if (i == -1) {
            isValidOption = false;
            break;
        } else {
            option = option.substring(i + r.length - 1);
        }
    }
    return isValidOption;

}

function getProducts(rows : [string,string], 
                        numOfBrokenAtEndOfRow : number,
                        brokenList : number[]) : [string[], string[]] {
    let rowOptions : [string[], string[]] = [[], []];
    for (let j = 0; j < rows.length; j++) {
        let rowSeg = rows[j];
        let options : string[] = [];
        if (j > 0) {
            if (numOfBrokenAtEndOfRow + 1 > brokenList[0]) {
                rowSeg = rowSeg.replace("?", ".");
            }
        }
        for (const char of rowSeg) {
            if (char == '.') {
                if (options.length == 0) {
                    options.push('.');
                } else {
                    for (let i = 0; i < options.length; i++) {
                        options[i] += '.';
                    }
                }
            } else if (char == '#') {
                if (options.length == 0) {
                    options.push('#');
                } else {
                    for (let i = 0; i < options.length; i++) {
                        options[i] += '#';
                    }
                }
            } else if (char == '?') {
                if (options.length == 0) {
                    options.push('.');
                    options.push('#');
                } else {
                    let newOptions : string[] = [];
                    for (let option of options) {
                        newOptions.push(option + '.');
                        newOptions.push(option + '#');
                    }
                    options = newOptions;
                }
            }
        }

        for (let i = 0; i < options.length; i++) {
            options[i] += '.';
        }
        rowOptions[j] = options;
    }


    let requiredStrings : string[] = [];
    let totalBroken = 0; 
    for (const num of brokenList) {
        requiredStrings.push(new Array(num).fill('#').reduce((p,n) => p + n) + '.');
        totalBroken += num;
    }
    
    let cleanedRowOptions : [string[],string[]] = [[],[]];
    for (let j = 0; j < rowOptions.length; j++) {
        const options = rowOptions[j];
        let cleanedOptions : string[] = [];
        for (let i = 0; i < options.length; i++) {
            let numBroken = (options[i].match(/#/g) || []).length;
            if (numBroken == totalBroken) {
                if (options[i][options[i].length - 1] != '.') {
                    cleanedOptions.push(options[i] + '.');
                } else {
                    cleanedOptions.push(options[i]);
                }
            }
        }
        cleanedRowOptions[j] = cleanedOptions;
    }

    let filteredRowOptions : [string[], string[]] = [[], []];
    for (let j = 0; j < cleanedRowOptions.length; j++) {
        const cleanedOptions = cleanedRowOptions[j];
        for (let option of cleanedOptions) {
            let optionCopy = option.substring(0,option.length - 1);
            if (isStringValid(option, requiredStrings)) {
                filteredRowOptions[j].push(optionCopy);
            }
        }
    }

    //console.log(filteredRowOptions);
    let finalOptions = [];

    for (const option1 of filteredRowOptions[0]) {
        for (const option2 of filteredRowOptions[1]) {
            let optionToAdd = option1;
            optionToAdd += option2;
            optionToAdd += option2;
            optionToAdd += option2;
            optionToAdd += option2;
            finalOptions.push(optionToAdd);
        }
    }

    //console.log(finalOptions);
    //console.log(finalOptions.length * finalOptions.length);
    let totalRequiredStrings = [...requiredStrings, ...requiredStrings,
                                ...requiredStrings, ...requiredStrings,
                                ...requiredStrings];
    
    let product = 1;    
    product = filteredRowOptions[0].length * (filteredRowOptions[1].length ** 4);
    //console.log(product);
    return filteredRowOptions;

    let total = 0;

    for (const option of finalOptions) {
        if (isStringValid(option,totalRequiredStrings)) total++;
    }
}
