// Convert index to letter 
const idxToLetter = (idx: number): string => {
    let temp: number;
    let letter: string = '';
    let column: number = idx + 1;
    while (column > 0)
    {
        temp = (column - 1) % 25;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 25;
    }

    return letter;
}

export default idxToLetter;