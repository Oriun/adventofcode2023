const fs = require('fs')

console.log("Part 1 : ", withoutSpelledDigits())
console.log("Part 2 : ", withSpelledDigits())

function withoutSpelledDigits() {
    return fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .reduce((sum, line) =>
            sum + getCalibrationValue(line, false), 0)
}

function withSpelledDigits() {
    return fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .reduce((sum, line) =>
            sum + getCalibrationValue(line, true), 0)
}

function getCalibrationValue(line, spelledDigitsEnabled) {
    let first = 0
    let last = 0
    for (let index = 0; index < line.length; index++)
        if ((first = extractDigit({
                line,
                index,
                forard: true,
                spelledDigitsEnabled
            })) !== null) break
    for (let index = line.length - 1; index >= 0; index--)
        if ((last = extractDigit({
                line,
                index,
                forard: false,
                spelledDigitsEnabled
            })) !== null) break

    return +`${first}${last}`
}

function extractDigit({
    line,
    index,
    forward,
    spelledDigitsEnabled
}) {
    const charCode = line.charCodeAt(index)
    if (charCode >= 48 && charCode <= 57) {
        return line[index]
    }
    if (!spelledDigitsEnabled) return null
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
            return line.slice(index - digit.length + 1, index + 1) === digit
        }
    })
}