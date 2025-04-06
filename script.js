document.addEventListener('DOMContentLoaded', () => {
    // Get UI elements
    const visualizeButton = document.getElementById('visualize');
    const clearButton = document.getElementById('clear');
    const algorithmSelect = document.getElementById('algorithm');
    
    // Comparison mode elements
    const compareModeBtn = document.getElementById('compare-mode');
    const exitCompareBtn = document.getElementById('exit-compare');
    const startComparisonBtn = document.getElementById('start-comparison');
    const compareControls = document.querySelector('.compare-controls');
    const mainGrid = document.getElementById('grid');
    const comparisonContainer = document.getElementById('comparison-container');
    const grid1Element = document.getElementById('grid1');
    const grid2Element = document.getElementById('grid2');
    const algorithm1Select = document.getElementById('algorithm1');
    const algorithm2Select = document.getElementById('algorithm2');
    
    // Comparison grids and algorithms
    let grid1 = null;
    let grid2 = null;
    let algorithms1 = null;
    let algorithms2 = null;
    let isCompareMode = false;
    
    // Add event listeners
    visualizeButton.addEventListener('click', () => {
        const selectedAlgorithm = algorithmSelect.value;
        algorithms.visualize(selectedAlgorithm);
    });
    
    clearButton.addEventListener('click', () => {
        grid.resetGrid();
    });
    
    // Toggle comparison mode
    compareModeBtn.addEventListener('click', () => {
        enterComparisonMode();
    });
    
    exitCompareBtn.addEventListener('click', () => {
        exitComparisonMode();
    });
    
    startComparisonBtn.addEventListener('click', () => {
        startComparison();
    });
    
    function enterComparisonMode() {
        isCompareMode = true;
        
        // Hide main grid and show comparison container
        mainGrid.style.display = 'none';
        document.querySelector('.algorithm-info')?.remove();
        comparisonContainer.style.display = 'block';
        
        // Show comparison controls
        compareControls.style.display = 'flex';
        
        // Hide regular controls
        visualizeButton.style.display = 'none';
        compareModeBtn.style.display = 'none';
        algorithmSelect.style.display = 'none';
        
        // Initialize comparison grids
        initializeComparisonGrids();
        
        // Add comparison mode clear and maze buttons if they don't exist yet
        addComparisonModeButtons();
    }
    
    function addComparisonModeButtons() {
        // Check if the buttons are already there
        if (!document.getElementById('clear-comparison')) {
            // Create clear button for comparison mode
            const clearComparisonBtn = document.createElement('button');
            clearComparisonBtn.id = 'clear-comparison';
            clearComparisonBtn.textContent = 'Clear Board';
            clearComparisonBtn.className = 'clear-btn';
            
            clearComparisonBtn.addEventListener('click', () => {
                if (grid1 && grid2) {
                    // Reset both grids
                    grid1.clearBoard();
                    grid2.clearBoard();
                    
                    // Reset walls without affecting start/end positions
                    grid1.clearWalls();
                    grid2.clearWalls();
                }
            });
            
            // Create maze generation button for comparison mode
            const generateMazeComparisonBtn = document.createElement('button');
            generateMazeComparisonBtn.id = 'generate-maze-comparison';
            generateMazeComparisonBtn.textContent = 'Generate Maze';
            generateMazeComparisonBtn.className = 'maze-btn';
            
            generateMazeComparisonBtn.addEventListener('click', () => {
                if (grid1 && grid2) {
                    // Clear any visualizations before generating maze
                    grid1.clearBoard();
                    grid2.clearBoard();
                    
                    // Generate maze
                    generateIdenticalMaze();
                }
            });
            
            // Create a container for these buttons
            const comparisonButtonsContainer = document.createElement('div');
            comparisonButtonsContainer.className = 'comparison-buttons';
            
            comparisonButtonsContainer.appendChild(clearComparisonBtn);
            comparisonButtonsContainer.appendChild(generateMazeComparisonBtn);
            
            // Add to comparison controls
            compareControls.appendChild(comparisonButtonsContainer);
        }
    }
    
    function exitComparisonMode() {
        isCompareMode = false;
        
        // Show main grid and hide comparison container
        mainGrid.style.display = 'grid';
        comparisonContainer.style.display = 'none';
        
        // Hide comparison controls
        compareControls.style.display = 'none';
        
        // Show regular controls
        visualizeButton.style.display = 'inline-block';
        compareModeBtn.style.display = 'inline-block';
        algorithmSelect.style.display = 'inline-block';
        
        // Recreate algorithm info
        createAlgorithmInfo();
    }
    
    function initializeComparisonGrids() {
        // Clear previous grids if they exist
        grid1Element.innerHTML = '';
        grid2Element.innerHTML = '';
        
        // Create new grids
        grid1 = new Grid(20, 25, grid1Element);
        grid2 = new Grid(20, 25, grid2Element);
        
        // Create identical walls on both grids
        synchronizeGrids();
        
        // Initialize algorithms for both grids
        algorithms1 = new Algorithms(grid1);
        algorithms2 = new Algorithms(grid2);
    }
    
    function synchronizeGrids() {
        // Set identical start and end nodes
        const startRow = Math.floor(grid1.rows / 2);
        const startCol = Math.floor(grid1.cols / 4);
        const endRow = Math.floor(grid1.rows / 2);
        const endCol = Math.floor(grid1.cols * 3 / 4);
        
        grid1.setStartNode(startRow, startCol);
        grid1.setEndNode(endRow, endCol);
        
        grid2.setStartNode(startRow, startCol);
        grid2.setEndNode(endRow, endCol);
        
        // Generate identical maze on both grids
        generateIdenticalMaze();
    }
    
    function generateIdenticalMaze() {
        // Clear existing walls
        grid1.clearWalls();
        grid2.clearWalls();
        
        // Use the same seed for both grids
        const seed = Date.now();
        const random = new SeededRandom(seed);
        
        // Create identical mazes
        for (let row = 0; row < grid1.rows; row++) {
            for (let col = 0; col < grid1.cols; col++) {
                const node1 = grid1.nodes[row][col];
                const node2 = grid2.nodes[row][col];
                
                // Don't place walls on start or end nodes
                if (node1.isStart || node1.isEnd) continue;
                
                // Use the same random value for both grids
                if (random.next() < 0.25) {
                    grid1.toggleWall(row, col);
                    grid2.toggleWall(row, col);
                }
            }
        }
    }
    
    // Simple seeded random number generator
    class SeededRandom {
        constructor(seed) {
            this.seed = seed % 2147483647;
            if (this.seed <= 0) this.seed += 2147483646;
        }
        
        next() {
            this.seed = (this.seed * 16807) % 2147483647;
            return this.seed / 2147483647;
        }
    }
    
    function startComparison() {
        // Get selected algorithms
        const algo1 = algorithm1Select.value;
        const algo2 = algorithm2Select.value;
        
        // Update algorithm names in the stats display
        document.getElementById('algo1-name').textContent = getAlgorithmName(algo1);
        document.getElementById('algo2-name').textContent = getAlgorithmName(algo2);
        
        // Reset stats
        resetComparisonStats();
        
        // Run algorithms and measure performance
        runComparison(algo1, algo2);
    }
    
    function getAlgorithmName(algoCode) {
        const names = {
            'bfs': 'Breadth-First Search',
            'dfs': 'Depth-First Search',
            'dijkstra': 'Dijkstra\'s Algorithm',
            'bellmanford': 'Bellman-Ford Algorithm',
            'floydwarshall': 'Floyd-Warshall Algorithm',
            'astar': 'A* Algorithm'
        };
        return names[algoCode] || algoCode;
    }
    
    function resetComparisonStats() {
        document.getElementById('algo1-visited-count').textContent = '0';
        document.getElementById('algo1-path-length').textContent = '0';
        document.getElementById('algo1-time').textContent = '0';
        
        document.getElementById('algo2-visited-count').textContent = '0';
        document.getElementById('algo2-path-length').textContent = '0';
        document.getElementById('algo2-time').textContent = '0';
    }
    
    function runComparison(algo1, algo2) {
        // Clear previous visualizations
        grid1.clearBoard();
        grid2.clearBoard();
        
        // Disable start button during animation
        startComparisonBtn.disabled = true;
        
        // First algorithm
        const startTime1 = performance.now();
        const visitedNodes1 = runAlgorithm(algo1, algorithms1);
        const shortestPath1 = algorithms1.getShortestPath(grid1.endNode);
        const endTime1 = performance.now();
        
        // Second algorithm
        const startTime2 = performance.now();
        const visitedNodes2 = runAlgorithm(algo2, algorithms2);
        const shortestPath2 = algorithms2.getShortestPath(grid2.endNode);
        const endTime2 = performance.now();
        
        // Update stats
        updateStats(1, visitedNodes1.length, shortestPath1.length, endTime1 - startTime1);
        updateStats(2, visitedNodes2.length, shortestPath2.length, endTime2 - startTime2);
        
        // Animate the algorithms side by side
        animateComparison(visitedNodes1, shortestPath1, visitedNodes2, shortestPath2);
    }
    
    function runAlgorithm(algorithm, algorithmInstance) {
        let visitedNodesInOrder;
        
        switch (algorithm) {
            case 'bfs':
                visitedNodesInOrder = algorithmInstance.bfs();
                break;
            case 'dfs':
                visitedNodesInOrder = algorithmInstance.dfs();
                break;
            case 'dijkstra':
                visitedNodesInOrder = algorithmInstance.dijkstra();
                break;
            case 'bellmanford':
                visitedNodesInOrder = algorithmInstance.bellmanFord();
                break;
            case 'floydwarshall':
                visitedNodesInOrder = algorithmInstance.floydWarshall();
                break;
            case 'astar':
                visitedNodesInOrder = algorithmInstance.astar();
                break;
            default:
                visitedNodesInOrder = algorithmInstance.dijkstra();
        }
        
        return visitedNodesInOrder;
    }
    
    function updateStats(algoNum, visitedCount, pathLength, time) {
        document.getElementById(`algo${algoNum}-visited-count`).textContent = visitedCount;
        document.getElementById(`algo${algoNum}-path-length`).textContent = pathLength;
        document.getElementById(`algo${algoNum}-time`).textContent = time.toFixed(2);
    }
    
    function animateComparison(visitedNodes1, shortestPath1, visitedNodes2, shortestPath2) {
        // Fast animation for comparison
        const animationSpeed = 5;
        
        // Determine the maximum number of nodes to animate
        const maxVisitedNodes = Math.max(visitedNodes1.length, visitedNodes2.length);
        
        // Animate visited nodes
        for (let i = 0; i < maxVisitedNodes; i++) {
            setTimeout(() => {
                // Animate algorithm 1
                if (i < visitedNodes1.length) {
                    const node = visitedNodes1[i];
                    if (!node.isStart && !node.isEnd) {
                        node.element.classList.add('visited');
                    }
                }
                
                // Animate algorithm 2
                if (i < visitedNodes2.length) {
                    const node = visitedNodes2[i];
                    if (!node.isStart && !node.isEnd) {
                        node.element.classList.add('visited');
                    }
                }
                
                // When we're done with visited nodes, animate shortest paths
                if (i === maxVisitedNodes - 1) {
                    setTimeout(() => {
                        animateComparisonPaths(shortestPath1, shortestPath2, animationSpeed);
                    }, animationSpeed);
                }
            }, animationSpeed * i);
        }
    }
    
    function animateComparisonPaths(path1, path2, animationSpeed) {
        const maxPathLength = Math.max(path1.length, path2.length);
        
        for (let i = 0; i < maxPathLength; i++) {
            setTimeout(() => {
                // Animate path 1
                if (i < path1.length) {
                    const node = path1[i];
                    if (!node.isStart && !node.isEnd) {
                        node.element.classList.remove('visited');
                        node.element.classList.add('path');
                    }
                }
                
                // Animate path 2
                if (i < path2.length) {
                    const node = path2[i];
                    if (!node.isStart && !node.isEnd) {
                        node.element.classList.remove('visited');
                        node.element.classList.add('path');
                    }
                }
                
                // Re-enable the start comparison button when done
                if (i === maxPathLength - 1) {
                    startComparisonBtn.disabled = false;
                }
            }, animationSpeed * 2 * i);
        }
    }
    
    // Speed control (optional, you can add this later)
    function createSpeedControl() {
        const controlsDiv = document.querySelector('.controls');
        const speedControl = document.createElement('div');
        speedControl.className = 'speed-control';
        
        const speedLabel = document.createElement('label');
        speedLabel.textContent = 'Speed: ';
        
        const speedSelect = document.createElement('select');
        speedSelect.id = 'speed';
        
        const speeds = [
            { label: 'Slow', value: 50 },
            { label: 'Medium', value: 25 },
            { label: 'Fast', value: 10 },
            { label: 'Very Fast', value: 5 }
        ];
        
        speeds.forEach(speed => {
            const option = document.createElement('option');
            option.value = speed.value;
            option.textContent = speed.label;
            if (speed.value === algorithms.animationSpeed) {
                option.selected = true;
            }
            speedSelect.appendChild(option);
        });
        
        speedSelect.addEventListener('change', () => {
            algorithms.animationSpeed = parseInt(speedSelect.value);
        });
        
        speedControl.appendChild(speedLabel);
        speedControl.appendChild(speedSelect);
        controlsDiv.appendChild(speedControl);
    }
    
    // Random maze generator (optional feature)
    function createMazeGenerator() {
        const controlsDiv = document.querySelector('.controls');
        const mazeButton = document.createElement('button');
        mazeButton.id = 'generate-maze';
        mazeButton.textContent = 'Generate Maze';
        
        mazeButton.addEventListener('click', () => {
            generateRandomMaze();
        });
        
        controlsDiv.appendChild(mazeButton);
    }
    
    function generateRandomMaze() {
        // Clear existing walls
        grid.clearWalls();
        
        // Create a random maze
        for (let row = 0; row < grid.rows; row++) {
            for (let col = 0; col < grid.cols; col++) {
                const node = grid.nodes[row][col];
                
                // Don't place walls on start or end nodes
                if (node.isStart || node.isEnd) continue;
                
                // Randomly place walls (25% chance)
                if (Math.random() < 0.25) {
                    grid.toggleWall(row, col);
                }
            }
        }
    }
    
    // Create additional UI controls
    createSpeedControl();
    createMazeGenerator();
    
    // Add additional algorithm information
    function createAlgorithmInfo() {
        // Remove existing algorithm info if it exists
        const existingInfo = document.querySelector('.algorithm-info');
        if (existingInfo) existingInfo.remove();
        
        const algorithmInfo = document.createElement('div');
        algorithmInfo.className = 'algorithm-info';
        
        const infoContent = {
            'bfs': 'Breadth-First Search: Guarantees the shortest path in an unweighted graph. Visits nodes in layers, exploring all neighbors at the present depth before moving to nodes at the next depth level.',
            'dfs': 'Depth-First Search: Does not guarantee the shortest path. Explores as far as possible along each branch before backtracking.',
            'dijkstra': 'Dijkstra\'s Algorithm: Guarantees the shortest path. Works well with weighted graphs but is slower than BFS for unweighted graphs.',
            'bellmanford': 'Bellman-Ford Algorithm: Finds the shortest path in a weighted graph, even with negative edge weights. Can detect negative cycles. More versatile but slower than Dijkstra\'s algorithm.',
            'floydwarshall': 'Floyd-Warshall Algorithm: Finds the shortest paths between all pairs of nodes in a weighted graph. Useful for dense graphs but has higher time complexity (O(V³)) than other algorithms.',
            'astar': 'A* Algorithm: Uses heuristics to find the shortest path more efficiently than Dijkstra\'s by prioritizing paths that seem to lead closer to the target.'
        };
        
        const initialInfo = document.createElement('p');
        initialInfo.textContent = infoContent[algorithmSelect.value];
        algorithmInfo.appendChild(initialInfo);
        
        algorithmSelect.addEventListener('change', () => {
            initialInfo.textContent = infoContent[algorithmSelect.value];
        });
        
        document.body.insertBefore(algorithmInfo, document.getElementById('grid'));
    }
    
    createAlgorithmInfo();
}); 