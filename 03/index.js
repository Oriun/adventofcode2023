const fs = require('fs');

console.log("Part 1 : ", sumOfPartNumbers())
console.log("Part 2 : ", sumOfGearRatios())

// Part 1
function sumOfPartNumbers() {
    const matrix = fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .map(line => line.split(''))
    let sum = 0;
    for (let y = 0; y < matrix.length; y++) {
        const line = matrix[y]
        let store = ""
        for (let x = 0; x <= line.length; x++) {
            let digit = extractDigit(line[x])
            if (digit !== null) {
                store += digit
            } else {
                if (store.length > 0 && hasAdjacentToSymbol(x - store.length, y, store, matrix)) {
                    sum += +store
                }
                store = ""
            }
        }
    }
    return sum
}

// Part 2
function sumOfGearRatios() {
    const matrix = fs
        .readFileSync('./input.txt', 'utf8') //496 278
        .split('\n')
        .map(line => line.split(''))
    let sum = 0;
    for (let y = 0; y < matrix.length; y++) {
        const line = matrix[y]
        let gearIndex = -1;
        while ((gearIndex = line.indexOf('*', gearIndex + 1)) !== -1)
            sum += getGearRatio(gearIndex, y, matrix) || 0
    }
    return sum
}


function getGearRatio(x, y, matrix) {
    const edges = {
        top: [
            [-1, -1],
            [0, -1],
            [1, -1],
        ],
        right: [
            [1, 0],
        ],
        bottom: [
            [1, 1],
            [0, 1],
            [-1, 1],
        ],
        left: [
            [-1, 0]
        ]
    }
    const partNumbers = []
    for (const group in edges) {
        const numbersFound = edges[group].map(([a, b]) => extractNumber(x + a, y + b, matrix))
        if (numbersFound[1]) partNumbers.push(numbersFound[1])
        else partNumbers.push(...numbersFound.filter(n => n))

    }
    if (partNumbers.length !== 2) return null
    return partNumbers.reduce((a, b) => a * b)
}

function extractNumber(x, y, matrix) {
    if (!extractDigit(matrix[y]?. [x])) return null
    let leftBound = x
    let rightBound = x
    while (extractDigit(matrix[y][leftBound - 1])) leftBound--
    while (extractDigit(matrix[y][rightBound + 1])) rightBound++
    return +matrix[y].slice(leftBound, rightBound + 1).join('')
}

function hasAdjacentToSymbol(x, y, number, matrix) {
    const length = number.length
    if (
        isSpecialSymbol(matrix[y][x - 1]) ||
        isSpecialSymbol(matrix[y][x + length])
    ) return true

    for (let a = x - 1; a <= x + length; a++)
        if (
            isSpecialSymbol(matrix[y - 1]?. [a]) ||
            isSpecialSymbol(matrix[y + 1]?. [a])
        ) return true

    return false
}

function isSpecialSymbol(char) {
    if (!char) return false
    if (extractDigit(char) !== null) return false
    if (char === '.') return false
    return true
}

function extractDigit(char) {
    const charCode = char?.charCodeAt(0)
    if (charCode >= 48 && charCode <= 57) {
        return char
    }
    return null
}