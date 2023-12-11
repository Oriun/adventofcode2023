const fs = require('fs')

console.log('Part 2:', part1())
console.log('Part 2:', part2())

// Part 1
function part1() {
    const [times, distances] = fs.readFileSync('input.txt', 'utf8').split('\n')
        .map(line => parseList(line.split(':')[1]))
    return times.reduce((acc, time, i) => {
        const winningMoveRange = getWinningMoveRange(time, distances[i])
        if (winningMoveRange.length < 2) return acc
        const winningMoveCount = Math.floor(winningMoveRange[1]) - Math.ceil(winningMoveRange[0] - 1)
        return acc * winningMoveCount
    }, 1)
}

// Part 2
function part2() {
    const [times, distances] = fs.readFileSync('input.txt', 'utf8').replace(/ /gmi, "").split('\n')
        .map(line => parseList(line.split(':')[1]))
    return times.reduce((acc, time, i) => {
        const winningMoveRange = getWinningMoveRange(time, distances[i])
        if (winningMoveRange.length < 2) return acc
        const winningMoveCount = Math.floor(winningMoveRange[1]) - Math.ceil(winningMoveRange[0] - 1)
        return acc * winningMoveCount
    }, 1)
}



function getWinningMoveRange(time, distance) {
    /*
    s : number of milliseconds holded
    t : total milliseconds of the race
    d : distance traveled
    r : current max traveled distance

    d = (t - s) * s
    d = st - s^2
    d = -s^2 + st

    d > r
    -s^2 + st > r
    
    we assume d(s) is concave down and r is a positive integer
    
    -s^2 + st >= r + 1 
    -s^2 + st = r + 1 
    s^2 - st < -r - 1
    s^2 - st + r + 1 < 0


    ∆ = (-t)^2 - 4r - 4
    s = (t ± √∆) / 2
    */
    const discriminant = time ** 2 - 4 * distance - 4
    if (discriminant < 0) {
        return []
    } else if (discriminant === 0) {
        return [time / 2]
    }
    return [
        (time - Math.sqrt(discriminant)) / 2,
        (time + Math.sqrt(discriminant)) / 2
    ]
}

function parseList(line) {
    return line.split(' ').reduce((acc, item) => {
        if (item) {
            acc.push(parseInt(item))
        }
        return acc
    }, [])
}