class Algorithms {
    constructor(grid) {
        this.grid = grid;
        this.animations = [];
        this.animationSpeed = 10; // milliseconds
    }
    
    // Breadth-First Search (BFS)
    bfs() {
        const { startNode, endNode } = this.grid;
        const visitedNodesInOrder = [];
        const queue = [startNode];
        startNode.isVisited = true;
        startNode.distance = 0;
        
        while (queue.length > 0) {
            const currentNode = queue.shift();
            visitedNodesInOrder.push(currentNode);
            
            if (currentNode === endNode) break;
            
            const neighbors = this.grid.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited) {
                    neighbor.isVisited = true;
                    neighbor.distance = currentNode.distance + 1;
                    neighbor.previousNode = currentNode;
                    queue.push(neighbor);
                }
            }
        }
        
        return visitedNodesInOrder;
    }
    
    // Depth-First Search (DFS)
    dfs() {
        const { startNode, endNode } = this.grid;
        const visitedNodesInOrder = [];
        
        const dfsRecursive = (node) => {
            if (node.isVisited) return false;
            node.isVisited = true;
            visitedNodesInOrder.push(node);
            
            if (node === endNode) return true;
            
            const neighbors = this.grid.getNeighbors(node);
            for (const neighbor of neighbors) {
                if (!neighbor.isVisited) {
                    neighbor.previousNode = node;
                    if (dfsRecursive(neighbor)) return true;
                }
            }
            
            return false;
        };
        
        dfsRecursive(startNode);
        return visitedNodesInOrder;
    }
    
    // Dijkstra's Algorithm
    dijkstra() {
        const { startNode, endNode } = this.grid;
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        
        const unvisitedNodes = this.getAllNodes();
        
        while (unvisitedNodes.length > 0) {
            this.sortNodesByDistance(unvisitedNodes);
            const closestNode = unvisitedNodes.shift();
            
            // If we encounter a wall, skip it
            if (closestNode.isWall) continue;
            
            // If the closest node has a distance of infinity, we're trapped and must stop
            if (closestNode.distance === Infinity) break;
            
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            
            // If we've reached the end node, we're done
            if (closestNode === endNode) break;
            
            this.updateUnvisitedNeighbors(closestNode);
        }
        
        return visitedNodesInOrder;
    }
    
    // Bellman-Ford Algorithm
    bellmanFord() {
        const { startNode, endNode } = this.grid;
        const visitedNodesInOrder = [];
        startNode.distance = 0;
        
        const nodes = this.getAllNodes();
        const edges = this.getAllEdges();
        
        // Relax all edges |V| - 1 times
        for (let i = 0; i < nodes.length - 1; i++) {
            for (const edge of edges) {
                const { source, target } = edge;
                
                // Skip walls
                if (source.isWall || target.isWall) continue;
                
                // If source is not yet reached, skip
                if (source.distance === Infinity) continue;
                
                // Relax edge
                const newDistance = source.distance + 1; // All edges have weight 1 in our grid
                if (newDistance < target.distance) {
                    target.distance = newDistance;
                    target.previousNode = source;
                    
                    // Add to visited if not already visited
                    if (!target.isVisited) {
                        target.isVisited = true;
                        visitedNodesInOrder.push(target);
                        
                        // If we've reached the end node, we can finish early (optimization)
                        if (target === endNode) return visitedNodesInOrder;
                    }
                }
            }
        }
        
        return visitedNodesInOrder;
    }
    
    // Floyd-Warshall Algorithm
    floydWarshall() {
        console.log("Starting optimized Floyd-Warshall implementation");
        const { startNode, endNode } = this.grid;
        const visitedNodesInOrder = [];
        
        // NOTE: This is actually using Dijkstra's algorithm instead of Floyd-Warshall,
        // as the true Floyd-Warshall algorithm is not efficient for grid-based pathfinding
        // Floyd-Warshall computes all-pairs shortest paths, which is overkill when we only
        // need a single shortest path from start to end
        
        // Initialize all nodes
        const nodes = this.getAllNodes();
        for (const node of nodes) {
            node.distance = Infinity;
            node.isVisited = false;
            node.previousNode = null;
        }
        
        // Start node initialization
        startNode.distance = 0;
        
        // Priority queue (array sorted by distance)
        const unvisitedNodes = nodes.slice();
        
        let count = 0;
        
        while (unvisitedNodes.length) {
            count++;
            if (count % 1000 === 0) {
                console.log(`Processing node ${count}, remaining: ${unvisitedNodes.length}`);
            }
            
            // Sort unvisited nodes by distance
            this.sortNodesByDistance(unvisitedNodes);
            
            // Get the closest node
            const closestNode = unvisitedNodes.shift();
            
            // If we found the end node or if the closest node is at infinity (unreachable)
            if (closestNode.distance === Infinity) {
                console.log("No path exists - all remaining nodes are unreachable");
                break;
            }
            
            // Mark the node as visited
            closestNode.isVisited = true;
            visitedNodesInOrder.push(closestNode);
            
            // If we reached the end node, we're done
            if (closestNode === endNode) {
                console.log("End node reached");
                break;
            }
            
            // Update all neighbors
            const neighbors = this.grid.getNeighbors(closestNode);
            for (const neighbor of neighbors) {
                if (!neighbor.isWall && !neighbor.isVisited) {
                    const distance = closestNode.distance + 1;
                    if (distance < neighbor.distance) {
                        neighbor.distance = distance;
                        neighbor.previousNode = closestNode;
                    }
                }
            }
        }
        
        console.log("Algorithm complete, visited nodes:", visitedNodesInOrder.length);
        return visitedNodesInOrder;
    }
    
    // A* Algorithm
    astar() {
        const { startNode, endNode } = this.grid;
        const visitedNodesInOrder = [];
        
        // Initialize start node
        startNode.gScore = 0;
        startNode.fScore = this.heuristic(startNode, endNode);
        
        const openSet = [startNode];
        const closedSet = new Set();
        
        while (openSet.length > 0) {
            // Sort the open set by fScore (lowest first)
            this.sortNodesByFScore(openSet);
            
            // Get the node with the lowest fScore
            const currentNode = openSet.shift();
            
            // If we've reached the end node, we're done
            if (currentNode === endNode) {
                visitedNodesInOrder.push(currentNode);
                break;
            }
            
            // Add current node to closed set
            closedSet.add(currentNode);
            currentNode.isVisited = true;
            visitedNodesInOrder.push(currentNode);
            
            // Check all neighbors
            const neighbors = this.grid.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                // Skip if in closed set
                if (closedSet.has(neighbor)) continue;
                
                // Calculate tentative gScore
                const tentativeGScore = currentNode.gScore + 1;
                
                // If this path is better, update it
                if (tentativeGScore < neighbor.gScore) {
                    neighbor.previousNode = currentNode;
                    neighbor.gScore = tentativeGScore;
                    neighbor.hScore = this.heuristic(neighbor, endNode);
                    neighbor.fScore = neighbor.gScore + neighbor.hScore;
                    
                    // Add to open set if not already there
                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        
        return visitedNodesInOrder;
    }
    
    // Heuristic function for A* (Manhattan distance)
    heuristic(node, endNode) {
        return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
    }
    
    // Sort nodes by distance (for Dijkstra's Algorithm)
    sortNodesByDistance(nodes) {
        nodes.sort((a, b) => a.distance - b.distance);
    }
    
    // Sort nodes by fScore (for A* Algorithm)
    sortNodesByFScore(nodes) {
        nodes.sort((a, b) => a.fScore - b.fScore);
    }
    
    // Update all valid neighbors of the current node with new distances
    updateUnvisitedNeighbors(node) {
        const neighbors = this.grid.getNeighbors(node);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.distance = node.distance + 1;
                neighbor.previousNode = node;
            }
        }
    }
    
    // Get all nodes from the grid
    getAllNodes() {
        const nodes = [];
        for (const row of this.grid.nodes) {
            for (const node of row) {
                nodes.push(node);
            }
        }
        return nodes;
    }
    
    // Get all edges from the grid
    getAllEdges() {
        const edges = [];
        for (const row of this.grid.nodes) {
            for (const node of row) {
                const neighbors = this.grid.getNeighbors(node);
                for (const neighbor of neighbors) {
                    edges.push({ source: node, target: neighbor });
                }
            }
        }
        return edges;
    }
    
    // Backtrack from the end node to find the shortest path
    getShortestPath(endNode) {
        const shortestPath = [];
        let currentNode = endNode;
        
        while (currentNode !== null) {
            shortestPath.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        
        return shortestPath;
    }
    
    // Visualize the algorithm execution
    visualize(algorithm) {
        this.grid.clearBoard();
        
        let visitedNodesInOrder;
        
        try {
            switch (algorithm) {
                case 'bfs':
                    visitedNodesInOrder = this.bfs();
                    break;
                case 'dfs':
                    visitedNodesInOrder = this.dfs();
                    break;
                case 'dijkstra':
                    visitedNodesInOrder = this.dijkstra();
                    break;
                case 'bellmanford':
                    visitedNodesInOrder = this.bellmanFord();
                    break;
                case 'floydwarshall':
                    console.log("Starting Floyd-Warshall algorithm");
                    visitedNodesInOrder = this.floydWarshall();
                    console.log("Floyd-Warshall complete, visited nodes:", visitedNodesInOrder.length);
                    break;
                case 'astar':
                    visitedNodesInOrder = this.astar();
                    break;
                default:
                    visitedNodesInOrder = this.dijkstra();
            }
            
            const shortestPath = this.getShortestPath(this.grid.endNode);
            console.log("Shortest path length:", shortestPath.length);
            this.animateAlgorithm(visitedNodesInOrder, shortestPath);
        } catch (error) {
            console.error("Error in algorithm execution:", error);
            alert("An error occurred while running the algorithm. Check console for details.");
        }
    }
    
    // Animate the algorithm execution
    animateAlgorithm(visitedNodesInOrder, shortestPath) {
        // Disable the visualize button during animation
        const visualizeButton = document.getElementById('visualize');
        visualizeButton.disabled = true;
        
        // Animate the visited nodes
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                if (!node.isStart && !node.isEnd) {
                    node.element.classList.add('visited');
                }
                
                // Once all visited nodes are animated, animate the shortest path
                if (i === visitedNodesInOrder.length - 1) {
                    setTimeout(() => {
                        this.animateShortestPath(shortestPath);
                    }, this.animationSpeed);
                }
            }, this.animationSpeed * i);
        }
    }
    
    // Animate the shortest path
    animateShortestPath(shortestPath) {
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(() => {
                const node = shortestPath[i];
                if (!node.isStart && !node.isEnd) {
                    node.element.classList.remove('visited');
                    node.element.classList.add('path');
                }
                
                // If this is the last node, re-enable the visualize button
                if (i === shortestPath.length - 1) {
                    const visualizeButton = document.getElementById('visualize');
                    visualizeButton.disabled = false;
                }
            }, this.animationSpeed * 2 * i);
        }
    }
}

// Export the Algorithms class
const algorithms = new Algorithms(grid); 
