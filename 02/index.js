const fs = require('fs')

const MAX_COUNT_PER_COLOR = {
    red: 12,
    green: 13,
    blue: 14,
}

console.log("Part 1 : ", sumOfPossibleGamesId())
console.log("Part 2 : ", sumOfGamesPower())

// Part 1
function sumOfPossibleGamesId() {
    return fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .reduce((sum, line) => {
            const [id, counts] = parseGame(line)
            for (const color in MAX_COUNT_PER_COLOR)
                if (counts[color] > MAX_COUNT_PER_COLOR[color])
                    return sum
            return sum + +id
        }, 0)
}

// Part 2
function sumOfGamesPower() {
    return fs
        .readFileSync('./input.txt', 'utf8')
        .split('\n')
        .reduce((sum, line) => {
            const counts = parseGame(line)[1]
            const power = Object.values(counts).reduce((sum, count) => sum * count)
            return sum + power
        }, 0)
}



// Common part

function parseGame(line) {
    const counts = {
        red: 0,
        green: 0,
        blue: 0,
    }
    const [game, subsets] = line.split(':')
    const parsedSubsets = subsets.split(';').map(parseSubset)
    parsedSubsets.flat().forEach(([count, color]) => {
        counts[color] = Math.max(+count, counts[color])
    })
    const id = game.split(' ')[1]
    return [id, counts]

}

function parseSubset(subset) {
    const cubes = subset.split(', ')
    return cubes.map(cube =>
        ([count, color] = cube.trim().split(' '))
    )
}