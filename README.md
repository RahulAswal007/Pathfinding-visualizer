# Pathfinding Visualizer

A web-based application that visualizes various pathfinding algorithms on a grid.

## Features

- Visualize multiple pathfinding algorithms:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - Bellman-Ford Algorithm
  - Floyd-Warshall Algorithm
  - A* Algorithm
- Interactive grid to place walls and move start/end nodes
- Animation speed control
- Random maze generation
- Algorithm information display
- **Algorithm comparison mode** - Compare two algorithms side-by-side on identical grids

## How to Use

1. Open the `index.html` file in your web browser
2. Click and drag on the grid to create walls
3. Drag the start node (green) or end node (red) to change their positions
4. Select an algorithm from the dropdown menu
5. Click the "Visualize" button to see the algorithm in action
6. Use the "Clear Board" button to reset the visualization
7. Click "Generate Maze" to create a random maze

### Using Comparison Mode

1. Click the "Compare Mode" button to enter comparison mode
2. Select two different algorithms from the dropdowns
3. Click "Start Comparison" to visualize both algorithms side-by-side
4. View statistics for each algorithm including nodes visited, path length, and execution time
5. Click "Exit Compare Mode" to return to the standard view

## Algorithm Details

- **Breadth-First Search (BFS)**: Guarantees the shortest path in an unweighted graph. Visits nodes in layers, exploring all neighbors at the present depth before moving to nodes at the next depth level.

- **Depth-First Search (DFS)**: Does not guarantee the shortest path. Explores as far as possible along each branch before backtracking.

- **Dijkstra's Algorithm**: Guarantees the shortest path. Works well with weighted graphs but is slower than BFS for unweighted graphs.

- **Bellman-Ford Algorithm**: Finds the shortest path in a weighted graph, even with negative edge weights. Can detect negative cycles. More versatile but slower than Dijkstra's algorithm.

- **Floyd-Warshall Algorithm**: Finds the shortest paths between all pairs of nodes in a weighted graph. Useful for dense graphs but has higher time complexity (O(V³)) than other algorithms.

- **A* Algorithm**: Uses heuristics to find the shortest path more efficiently than Dijkstra's by prioritizing paths that seem to lead closer to the target.

## Technologies Used

- HTML
- CSS
- JavaScript (Vanilla)

## Future Improvements

- Add more algorithms (Greedy Best-First Search, Bidirectional Search)
- Implement weighted nodes for Dijkstra's and A* algorithms
- Add more maze generation algorithms (recursive division, etc.)
- Add animation for the algorithm's exploration process
- Implement mobile-friendly controls
- Add interactive tutorial mode
