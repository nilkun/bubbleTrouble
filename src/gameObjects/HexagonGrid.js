// Class for creating and managing a hexagon grid

export default class HexagonGrid {
    constructor(gridOn, ui, screenWidth, crop, columns, rows, innerRadius, offsetX = 1, offsetY = 0) {

        this.image = document.createElement("canvas");

        const gameAreaWidth = screenWidth - crop * 2;
        this.hexWidth = gameAreaWidth / (columns + .5); // needs .5 more for row below to fit the same amount
        this.croppedLeft = crop;
        this.croppedTop = 0;

        this.radius = this.hexWidth / 2; // innerRadius;

        // "size of a tile"
        this.unitEdge = (1 / Math.cos(Math.PI / 6));
        this.edge = this.radius * this.unitEdge;
        this.diff = this.edge - this.radius;

        this.hexHouseHeight = this.edge * 1.5;
        this.xOffset = offsetX;
        this.yOffset = offsetY;

        this.lastY = 0;

        this.isEnabled = gridOn;

        this.rows = 0; // set later
        this.columns = Math.ceil(screenWidth / this.hexWidth) + 1; // Add one for cropping

        this.ui = ui;
        this.gridHeight = rows * this.hexHouseHeight; 
        this.yMovement = 0; // y displacement
        this.index = 0; 
        this.maxIndex = rows;

        this.resize(screenWidth);
    }

    update(elapsedTime) {
        this.index = (this.index + elapsedTime * this.ui.gameSpeed) % this.maxIndex;
        this.yMovement = this.index * this.hexHouseHeight;
    }

    toggle() {
        this.isEnabled = !this.isEnabled;
        this.ui.parent.gridIsOn = !this.ui.parent.gridIsOn;
    }

    // index of the row at the top of the screen
    getFirstIndex() {
        // index of the top item
        return (this.maxIndex - Math.floor(this.index)) % this.maxIndex;         
    }


    // index of the (probably invisible) row at the bottom of the screen
    getLastIndex() {
        return (this.maxIndex - Math.floor(this.index) - 1) % this.maxIndex;
    }

    getIndexFromEnd(number) {
        return (this.maxIndex - Math.floor(this.index) - 1 - number) % this.maxIndex;
    }
   
    compareCoordsToPos(x, y, col2, row2) {
        let c2 = col2;
        let r2 = row2;
        if(Math.floor(row2) % 2 === 0) c2 += .5;
        c2 = c2 * this.hexWidth + this.croppedLeft + this.radius; // CENTER
        r2 = (this.hexHouseHeight * row2 + this.edge + this.yMovement) % this.gridHeight; // yMovement;
        return (x - c2)*(x - c2) + (y - r2)*(y - r2);
    }

    getTopLeft(col, row) { 
        // Used for rendering bubbles
        let x = col; 
        let y = row;
        if(Math.floor(row) % 2 === 0) x += .5;
        x = x * this.hexWidth + this.croppedLeft; // Left
        y =  (this.hexHouseHeight * row + this.diff + this.yMovement) % this.gridHeight; // Almost at the top  
        return { x, y }
    }    
    
    resize(width) {    
        this.image.width = width;
        this.image.height = (this.image.width * 4 / 3) + this.hexHouseHeight * 3; // (aspect ratio 1.33) extra for scrolling
        this.rows = this.image.height / this.hexHouseHeight;
        // Create grid
        this.create();
    }

    fillOne(col, row, color = "red", context = this.image.getContext("2d"), scale) {
        const displaceY = 0;
        const roofHeight = this.edge * .5; // the height of the triangle

        let x1 = scale * (this.croppedLeft + col * this.hexWidth + (row % 2 == 0 ? this.hexWidth : this.radius));        
        let x2 = x1 + this.radius * scale;
        let x3 = x1 - this.radius * scale;

        let y1 = scale * (this.yMovement + row * this.hexHouseHeight);
        let y2 = y1 + roofHeight * scale;
        let y3 = y2 + this.edge * scale;   
        let y4 = y3 + roofHeight * scale;

        context.beginPath();
        context.moveTo(x1, y1); // START
        context.lineTo(x2, y2); // DOWN RIGHT
        context.lineTo(x2, y3); // DOWN
        context.lineTo(x1, y4); // DOWN LEFT
        context.lineTo(x3, y3); // UP LEFT
        context.lineTo(x3, y2); // UP
        context.fillStyle = color;
        context.fill();
    }

    getPosition(x, y) { // gets the row and column for the cannonballs

        if(y > this.gridHeight) return { col: -100, row: -100 };
        y = (y + this.gridHeight - this.yMovement) % this.gridHeight;


        let row = Math.floor((y) / this.hexHouseHeight);
        let col = Math.floor(((x - this.croppedLeft) / this.hexWidth)
                    - (row%2 == 0 ? .5 : 0));
        if(y / this.hexHouseHeight - row <= 1/3) { 
            x = (x - this.croppedLeft) / this.hexWidth - (row%2 == 0 ? .5 : 0) - col;
            y = y / this.hexHouseHeight - row;
            // Heron's formula * 3
            let area =  Math.abs(-x * (1/3 - y) - (1 - x) * (1/3 - y))
                        + Math.abs((1-x) * (-y) - (.5 - x) * (1/3 - y))
                        + Math.abs((.5-x) * (1/3 - y) - (-x) * (-y) );

            if(area > 1/3) { //  
                if(row%2 == 0) { // If the tentative row is even, then move up and +1 or 0
                    if(x >= .5) {
                        col += 1; 
                    }
                } 
                else { // odd rows
                    if(x <= .5) { 
                        col -= 1; 
                    }
                }
                // Always move up one row
                row--;
            } // End of checking
        }   
        return { col, row }
    }

    create() {
        // Create hexagon variables
        const displaceX = this.croppedLeft - (Math.ceil(this.croppedLeft / this.hexWidth) * this.hexWidth) - this.radius;
        const displaceY = 0;
        const roofHeight = this.edge * .5; // the height of the triangle

        // For storing positions
        let x1, x2, y1, y2, y3, y4;

        // Get rendering context
        const context = this.image.getContext("2d");

        for(let col = 0; col < this.columns * 2; col++) {
            x1 = displaceX + col * this.radius;
            x2 = x1 + this.radius;

            y1 = col % 2 ? displaceY + this.edge + roofHeight: displaceY;
            context.moveTo(x1, y1); // START

            for(let row = 0; row < this.rows / 2; ++row) {        
                y2 = y1 + this.edge;
                y2 = y2 + roofHeight;

                y2 = y1 + roofHeight;
                y3 = y2 + this.edge;
                y4 = y3 + roofHeight;
                context.moveTo(x1, y1); // START
                context.lineTo(x2, y2); // DOWN RIGHT
                context.lineTo(x2, y3); // DOWN
                context.lineTo(x1, y4); // DOWN LEFT

                y1 = y4 + this.edge;
            }
        }

        // Fill in the missing lines at the top and the bottom
        y1 = displaceY + roofHeight;
        y2 = displaceY;
        for(let col = 0; col < this.columns; col++) {
            x1 = displaceX + 2 * col * this.radius + this.radius;
            x2 = x1 + this.radius;
            context.moveTo(x1, y1); // TOP
            context.lineTo(x2, y2); 
            // context.moveTo(x1 - this.radius, y2 + (Math.ceil(this.rows / 2 )) * this.hexHouseHeight); // BOTTOM
            // context.lineTo(x2 - this.radius, y1 + (Math.ceil(this.rows / 2 )) * this.hexHouseHeight);
        }
        
        // Fill in missing lines to the left
        for(let row = 0; row < this.rows / 2; row++) {
            y1 = y2 + this.edge * 2;
            y2 = y1 + this.edge; 
            context.moveTo(displaceX, y1); // TOP
            context.lineTo(displaceX, y2); 
        }
        context.stroke();
    }

    render(renderer) {
        this.isEnabled && renderer.drawGrid(this);
    }
}

    
