class Grid {
    constructor(rows = 25, cols = 50, gridElement = null) {
        this.rows = rows;
        this.cols = cols;
        this.nodes = [];
        this.startNode = null;
        this.endNode = null;
        this.isMouseDown = false;
        this.isMovingStart = false;
        this.isMovingEnd = false;
        this.gridElement = gridElement || document.getElementById('grid');
        
        // Adjust grid size based on window width (only for main grid)
        if (!gridElement) {
            this.adjustGridSize();
            window.addEventListener('resize', () => this.adjustGridSize());
        }
        
        // Initialize the grid
        this.initialize();
    }
    
    adjustGridSize() {
        const width = window.innerWidth;
        if (width < 700) {
            this.cols = 20;
            this.rows = 20;
        } else if (width < 900) {
            this.cols = 30;
            this.rows = 20;
        } else if (width < 1100) {
            this.cols = 40;
            this.rows = 20;
        } else {
            this.cols = 50;
            this.rows = 25;
        }
    }
    
    initialize() {
        this.gridElement.innerHTML = '';
        this.nodes = [];
        
        // Update grid template
        this.gridElement.style.gridTemplateColumns = `repeat(${this.cols}, ${this.gridElement.classList.contains('compare-grid') ? '15px' : '20px'})`;
        this.gridElement.style.gridTemplateRows = `repeat(${this.rows}, ${this.gridElement.classList.contains('compare-grid') ? '15px' : '20px'})`;
        
        // Create nodes
        for (let row = 0; row < this.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < this.cols; col++) {
                const nodeElement = this.createNodeElement(row, col);
                this.gridElement.appendChild(nodeElement);
                
                const node = {
                    row,
                    col,
                    isStart: false,
                    isEnd: false,
                    isWall: false,
                    isVisited: false,
                    isPath: false,
                    distance: Infinity,
                    previousNode: null,
                    element: nodeElement,
                    fScore: Infinity,  // For A* algorithm
                    gScore: Infinity,  // For A* algorithm
                    hScore: 0          // For A* algorithm
                };
                
                currentRow.push(node);
            }
            this.nodes.push(currentRow);
        }
        
        // Set default start and end nodes
        const startRow = Math.floor(this.rows / 2);
        const startCol = Math.floor(this.cols / 4);
        const endRow = Math.floor(this.rows / 2);
        const endCol = Math.floor(this.cols * 3 / 4);
        
        this.setStartNode(startRow, startCol);
        this.setEndNode(endRow, endCol);
        
        // Add mouse event listeners to the grid
        this.gridElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.gridElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.gridElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Prevent context menu on right click
        this.gridElement.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    createNodeElement(row, col) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.dataset.row = row;
        nodeElement.dataset.col = col;
        return nodeElement;
    }
    
    setStartNode(row, col) {
        if (this.startNode) {
            this.startNode.isStart = false;
            this.startNode.element.classList.remove('start');
        }
        
        const node = this.nodes[row][col];
        node.isStart = true;
        node.element.classList.add('start');
        this.startNode = node;
    }
    
    setEndNode(row, col) {
        if (this.endNode) {
            this.endNode.isEnd = false;
            this.endNode.element.classList.remove('end');
        }
        
        const node = this.nodes[row][col];
        node.isEnd = true;
        node.element.classList.add('end');
        this.endNode = node;
    }
    
    toggleWall(row, col) {
        const node = this.nodes[row][col];
        if (node.isStart || node.isEnd) return;
        
        node.isWall = !node.isWall;
        node.element.classList.toggle('wall');
    }
    
    clearBoard() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.nodes[row][col];
                
                // Reset node properties
                node.isVisited = false;
                node.isPath = false;
                node.distance = Infinity;
                node.previousNode = null;
                node.fScore = Infinity;
                node.gScore = Infinity;
                node.hScore = 0;
                
                // Remove visualization classes
                node.element.classList.remove('visited', 'path');
            }
        }
    }
    
    clearWalls() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.nodes[row][col];
                if (node.isWall) {
                    node.isWall = false;
                    node.element.classList.remove('wall');
                }
            }
        }
    }
    
    resetGrid() {
        this.clearBoard();
        this.clearWalls();
    }
    
    getNodeFromElement(element) {
        const row = parseInt(element.dataset.row);
        const col = parseInt(element.dataset.col);
        return this.nodes[row][col];
    }
    
    handleMouseDown(e) {
        e.preventDefault();
        this.isMouseDown = true;
        
        const element = e.target;
        if (!element.classList.contains('node')) return;
        
        const node = this.getNodeFromElement(element);
        
        if (node.isStart) {
            this.isMovingStart = true;
            return;
        }
        
        if (node.isEnd) {
            this.isMovingEnd = true;
            return;
        }
        
        this.toggleWall(node.row, node.col);
    }
    
    handleMouseUp() {
        this.isMouseDown = false;
        this.isMovingStart = false;
        this.isMovingEnd = false;
    }
    
    handleMouseMove(e) {
        if (!this.isMouseDown) return;
        
        const element = e.target;
        if (!element.classList.contains('node')) return;
        
        const node = this.getNodeFromElement(element);
        
        if (this.isMovingStart) {
            if (!node.isEnd && !node.isWall) {
                this.setStartNode(node.row, node.col);
            }
            return;
        }
        
        if (this.isMovingEnd) {
            if (!node.isStart && !node.isWall) {
                this.setEndNode(node.row, node.col);
            }
            return;
        }
        
        if (!node.isStart && !node.isEnd) {
            this.toggleWall(node.row, node.col);
        }
    }
    
    getNeighbors(node) {
        const neighbors = [];
        const { row, col } = node;
        
        // Add neighbors in 4 directions: up, right, down, left
        if (row > 0) neighbors.push(this.nodes[row - 1][col]); // Up
        if (col < this.cols - 1) neighbors.push(this.nodes[row][col + 1]); // Right
        if (row < this.rows - 1) neighbors.push(this.nodes[row + 1][col]); // Down
        if (col > 0) neighbors.push(this.nodes[row][col - 1]); // Left
        
        // Filter out walls
        return neighbors.filter(neighbor => !neighbor.isWall);
    }
}

// Export the Grid class
const grid = new Grid(); 