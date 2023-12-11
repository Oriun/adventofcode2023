const fs = require('fs')

const CARD_PRIORITY = "23456789TJQKA";
const CARD_PRIORITY_WITH_JOKER = "J23456789TQKA";
const JOKER = "J"
const HAND_TYPES = {
    HIGH_CARD: 0,
    ONE_PAIR: 1,
    TWO_PAIRS: 2,
    THREE_OF_A_KIND: 3,
    FULL_HOUSE: 4,
    FOUR_OF_A_KIND: 5,
    FIVE_OF_A_KIND: 6,
}
console.log('Part 1:', totalWinnigSum())
console.log('Part 2:', jokerRule())

// Part 1
function totalWinnigSum() {
    const lines = fs.readFileSync('input.txt', 'utf8').split('\n')
        .map(line => line.split(' '))
    const handsByType = Array.from(Object.keys(HAND_TYPES), () => [])
    for (const [hand, bid] of lines) {
        const handType = getHandType(hand)
        sortPushHands(
            handsByType[handType],
            getHandStrength(hand, CARD_PRIORITY) + ' ' + bid
        )
    }
    let total = 0
    for (let i = 0, j = 0; i < handsByType.length; j += handsByType[i++].length) {
        for (let k = 0; k < handsByType[i].length; k++) {
            const bid = handsByType[i][k].split(' ')[1]
            total += +bid * (j + k + 1)
        }
    }
    return total
}

// Part 2
function jokerRule() {
    const lines = fs.readFileSync('input.txt', 'utf8').split('\n')
        .map(line => line.split(' '))
    const handsByType = Array.from(Object.keys(HAND_TYPES), () => [])
    for (const [hand, bid] of lines) {
        const handType = getHandTypeWithJokerRule(hand)
        sortPushHands(
            handsByType[handType],
            getHandStrength(hand, CARD_PRIORITY_WITH_JOKER) + ' ' + bid
        )
    }
    let total = 0
    for (let i = 0, j = 0; i < handsByType.length; j += handsByType[i++].length) {
        for (let k = 0; k < handsByType[i].length; k++) {
            const bid = handsByType[i][k].split(' ')[1]
            total += +bid * (j + k + 1)
        }
    }
    return total
}

function sortPushHands(arr, item) {
    const index = arr.findIndex(i => i > item)
    if (index === -1) {
        arr.push(item)
    } else {
        arr.splice(index, 0, item)
    }
}

function getHandTypeWithJokerRule(hand) {
    const cards = getCardsMap(hand)
    const cardCounts = [...cards.entries()]
        .filter(([card]) => card !== JOKER)
        .map(([_, count]) => count)
    const jokerCount = cards.get(JOKER)
    if (!jokerCount) return getHandType(hand)
    if (jokerCount === 5) return HAND_TYPES.FIVE_OF_A_KIND
    if (cardCounts.includes(5 - jokerCount)) return HAND_TYPES.FIVE_OF_A_KIND
    if (cardCounts.includes(4 - jokerCount)) return HAND_TYPES.FOUR_OF_A_KIND
    if (jokerCount === 1) {
        if (cardCounts.every(c => c === 2)) return HAND_TYPES.FULL_HOUSE
        if (cardCounts.includes(2)) return HAND_TYPES.THREE_OF_A_KIND
        return HAND_TYPES.ONE_PAIR
    }
    return HAND_TYPES.THREE_OF_A_KIND
}

function getHandType(hand) {
    const cards = getCardsMap(hand)
    const cardCounts = [...cards.values()]
    if (cardCounts.includes(5)) return HAND_TYPES.FIVE_OF_A_KIND
    if (cardCounts.includes(4)) return HAND_TYPES.FOUR_OF_A_KIND
    if (cardCounts.includes(3) && cardCounts.includes(2)) return HAND_TYPES.FULL_HOUSE
    if (cardCounts.includes(3)) return HAND_TYPES.THREE_OF_A_KIND
    if (cardCounts.filter(c => c === 2).length === 2) return HAND_TYPES.TWO_PAIRS
    if (cardCounts.includes(2)) return HAND_TYPES.ONE_PAIR
    return HAND_TYPES.HIGH_CARD
}

function getHandStrength(hand, priorityList) {
    // We add 97 to the char code to make it human readable
    return hand.split('').map(card => String.fromCharCode(97 + priorityList.indexOf(card))).join('')
}

function getCardsMap(hand) {
    const cards = new Map()
    for (const card of hand.split('')) {
        cards.set(card, (cards.get(card) || 0) + 1)
    }
    return cards
}
