const fs = require('fs')

console.log(main())

function main() {
    return fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .reduce((sum, line) =>
            sum + getCalibrationValue(line), 0)
}

function getCalibrationValue(line) {
    let first = 0
    let last = 0
    for (let i = 0; i < line.length; i++)
        if ((first = extractDigit(line, i, true)) !== null) break
    for (let i = line.length - 1; i >= 0; i--)
        if ((last = extractDigit(line, i, false)) !== null) break
        
    return +`${first}${last}`
}

function extractDigit(line, index, forward) {
    const charCode = line.charCodeAt(index)
    if (charCode >= 48 && charCode <= 57) {
        return line[index]
    }
    const spelled = spelledDigit(line, index, forward)
    if (spelled >= 0) {
        return spelled
    }
    return null
}

function spelledDigit(line, index, forward) {
    let digits = [
        'zero', 'one', 'two', 'three', 'four',
        'five', 'six', 'seven', 'eight', 'nine'
    ]
    return digits.findIndex(digit => {
        if (forward) {
            return line.slice(index, index + digit.length) === digit
        } else {
            return line.slice(index - digit.length+1, index+1) === digit
        }
    })
}