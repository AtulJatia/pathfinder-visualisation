export function dijkrstas(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    let unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        let closestNode = unvisitedNodes.shift();

        if (closestNode.isWall) continue;

        if (closestNode.distance === Infinity) {
            return visitedNodesInOrder;
        }
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) {
            return visitedNodesInOrder;
        }
        updateUnvisitedNeighbours(closestNode, grid);
    }

}

function updateUnvisitedNeighbours(closestNode, grid) {
    const neighbours = getTheNeighbours(closestNode, grid);
    for (let neighbour of neighbours) {
        neighbour.distance = closestNode.distance + 1;
        neighbour.previousNode = closestNode;
    }
}

function getTheNeighbours(closestNode, grid) {
    const neighbours = [];
    const { row, col } = closestNode;
    if (row > 0) neighbours.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbours.push(grid[row + 1][col]);
    if (col > 0) neighbours.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]);
    return neighbours.filter(el => !el.isVisited);
}

function sortNodesByDistance(nodes) {
    nodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
    let nodes = [];
    for (let row of grid) {
        for (let node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function shortestPath(finishNode) {
    let currentNode = finishNode;
    const nodesInShortestOrder = [];
    while (currentNode !== null) {
        nodesInShortestOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestOrder;
}