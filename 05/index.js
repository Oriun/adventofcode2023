const fs = require("fs")

console.log("Part 1:", lowestLocationNumber())
console.log("Part 2:", lowestLocationNumberOfSeedRange())


// Part 1
function lowestLocationNumber() {
    const data = fs.readFileSync("input.txt", "utf8")
    const seeds = extractSeeds(data)
    const maps = extractMaps(data)
    return seeds.reduce((acc, seed) =>
        Math.min(acc, traverseMaps(maps, seed)), Infinity)
}


// Part 2
function lowestLocationNumberOfSeedRange() {
    const data = fs.readFileSync("input.txt", "utf8")
    const maps = extractMaps(data)
    const seedRanges = getRanges(extractSeeds(data))
    let lowest = Infinity
    while (seedRanges.length) {
        let [from, to] = seedRanges.shift()
        let sumDelta = 0
        for (const map of maps)
            for (const [destination, source, range] of map) {
                const isWrappingFrom = from >= source && from - source < range
                const isWrappingTo = to >= source && to - source < range
                const delta = destination - source
                if (isWrappingFrom && isWrappingTo) {
                    sumDelta += delta
                    from += delta
                    to += delta
                    break
                } else if(isWrappingFrom || isWrappingTo) {
                    if (isWrappingFrom) {
                        const middle = source + range
                        seedRanges.push([middle - sumDelta, to - sumDelta])
                        to = middle - 1
                    } else if (isWrappingTo) {
                        seedRanges.push([from - sumDelta, source - 1 - sumDelta])
                        from = source
                    }
                    sumDelta += delta
                    from += delta
                    to += delta
                    break;
                }
            }
        lowest = Math.min(lowest, from)
    }
    return lowest
}

function getRanges(seeds) {
    const batches = []
    for (let i = 0; i < seeds.length; i += 2) {
        batches.push([seeds[i], seeds[i] + seeds[i + 1]])
    }
    return batches
}

function traverseMaps(maps, seed) {
    let currentId = seed
    for (const map of maps)
        for (const [destination, source, range] of map)
            if (currentId >= source && currentId - source < range)
                currentId += destination - source
    return currentId
}

function extractMaps(data) {
    const parseLine = line => line.split(" ").map(cell => parseInt(cell))
    const parseMap = map => map.split("\n").map(parseLine)
    const cleanChunk = chunk => chunk.split("\n\n")[0]

    const [_, ...maps] = data.split("map:\n")
    return maps.map(cleanChunk).map(parseMap)
}

function extractSeeds(data) {
    const firstLine = data.slice(0, data.indexOf("\n"))
    const seedList = firstLine.split(": ")[1]
    const seeds = seedList
        .split(" ")
        .map(seed => parseInt(seed))
    return seeds
}