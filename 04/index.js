const fs = require('fs');

console.log("Part 1 : ", scratchcardsWorth())
console.log("Part 2 : ", computeTotalScratchcards())

// Part 1
function scratchcardsWorth() {
    return fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .reduce((sum, card) =>
            sum + getCardWorth(card), 0)
}

// Part 2
function computeTotalScratchcards() {
    const instanceCounts = {}
    fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .forEach((card) => {
            const [cardName, numbers] = card.split(':')
            const cardNumber = +cardName.split(' ').at(-1)
            instanceCounts[cardNumber] = (instanceCounts[cardNumber] || 0) + 1
            const matches = getMatchingNumbers(numbers)
            for (let i = 1; i <= matches; i++)
                instanceCounts[cardNumber + i] =
                (instanceCounts[cardNumber + i] || 0) +
                instanceCounts[cardNumber]
        }, 0)
    return Object.values(instanceCounts)
        .reduce((sum, count) => sum + count)
}

function getCardWorth(card) {
    let matches = getMatchingNumbers(card.split(':')[1])
    return matches-- > 0 ? 2 ** matches : 0
}

function getMatchingNumbers(numbersList) {
    const numbers = numbersList
        .split(' | ')
        .flatMap(numbers => numbers.split(' '))
        .filter(Boolean)

    return numbers.length - new Set(numbers).size;
}