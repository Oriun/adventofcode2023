const fs = require('fs')


console.log('Part 1:', part1())
console.log('Part 2:', part2())

// Part 1
function part1() {
    const [_directions, _, ...nodes] = fs.readFileSync('input.txt', 'utf8').split('\n')

    const directions = _directions.split('').map(a => a === "L" ? 0 : 1)
    const nodesMap = parseNodes(nodes)

    const cycles = getCycles('AAA', 'ZZZ', nodesMap, directions)
    return cycles
}

// Part 2
function part2() {
    const [_directions, _, ...nodes] = fs.readFileSync('input.txt', 'utf8').split('\n')

    const directions = _directions.split('').map(a => a === "L" ? 0 : 1)
    const nodesMap = parseNodes(nodes)

    const startNodes = Array.from(nodesMap.keys()).filter(key => key[2] === 'A')
    const cycles = startNodes.map(node => getCycles(node, 'Z', nodesMap, directions))

    return leastCommonMultiple(...cycles)
}

function greatestCommonDivisor(a, b) {
    if (b == 0) return a;
    return greatestCommonDivisor(b, a % b);
}

function leastCommonMultiple(...numbers) {
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++)
        result = (((numbers[i] * result)) / (greatestCommonDivisor(numbers[i], result)));

    return result;
}


function getCycles(startNode, stop, nodesMap, directions) {
    let i = 0,
        currentNode = startNode;
    const zIndexes = []
    while (true) {
        const nextNodes = nodesMap.get(currentNode)
        if (!nextNodes) break;
        if (currentNode === nextNodes[0] && nextNodes[0] === nextNodes[1]) break
        const k = i++ % directions.length
        nextNode = nextNodes[directions[k]]
        if (nextNode.endsWith(stop)) {
            if (zIndexes.find(n => n[1] === nextNode && n[2] === k)) break
            zIndexes.push([i, nextNode, k])
        }
        currentNode = nextNode
    }
    if (zIndexes.length > 1) throw new Error("Maybe I'll support this later")
    return zIndexes[0][0]
}

function parseNodes(nodes) {
    const map = new Map()
    for (const node of nodes) {
        const currentNode = node.slice(0, 3)
        const leftNode = node.slice(7, 10)
        const rightNode = node.slice(12, 15)
        map.set(currentNode, [leftNode, rightNode])
    }
    return map
}