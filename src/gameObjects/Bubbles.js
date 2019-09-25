import { Bubble, Cannonball, BubbleAnimation } from "./Bubble.js"

// test function: testFalling()
// the cannonball is fired from here, but it should probably be moved to the cannon class

class Bubbles {
    constructor(assets, renderer, grid, ui, columns, rows, width = 80) {

        this.list; // Will hold an array of arrays of bubbles
        this.images = assets.image;

        this.grid = grid;
        this.ui = ui;
        this.maxCannonballs = 5;
        this.cannonballIndex = 0;
        this.cannonballs = [];
        for(let i = 0; i < this.maxCannonballs; i++) this.cannonballs.push(new Cannonball(-100, -100, grid.hexWidth))

        // Search array for finding falling and connected
        this.searchArray = [];
        this.popQueue = [];
        this.connected;

        this.animations = [];

        // All bubbles falling to the ground
        this.falling = []
        this.fallSpeed = .25;
        this.bottom = 780 - this.grid.hexWidth * renderer.scale;
        this.scale = 1;

        this.popped = 0;
        this.rows = rows;
        this.columns = columns;

        // Create arrays
        this.createList();
        this.createSearchArray();

        this.hide(this.rows - 3);
        // this.testFalling();
        this.previousIndex = 0;
    }
    
    hide(rows) {
        for(let i = 0; i < this.list.length; i++) {
            for(let j = this.list[0].length - rows - 1; j < this.list[0].length; j++) {
                this.list[i][j].isVisible = false;
            }
        }
    }

    testFalling() {
        for(let i = 0; i < this.list.length; i++) {
            this.list[i][0].isVisible = false;
        }
    }

    pop(col, row) {
        this.list[col][row].isVisible = false;
    }

    createList() {
        this.list = new Array(this.columns);
        for(let i = 0; i < this.list.length; i++) {
            this.list[i] = new Array(this.rows);
            for(let j = 0; j < this.list[0].length; j++) {
                this.list[i][j] = new Bubble();
            }
        }
    }
    createSearchArray() {
        this.searchArray = new Array(this.columns);
        for(let i = 0; i < this.searchArray.length; i++) {
            this.searchArray[i] = new Array(this.rows).fill(false);
        }
    }
    
    resetSearchArray() {
        for(let i = 0; i < this.searchArray.length; i++) {
            for(let j = 0; j < this.searchArray[i].length; j++) {
                this.searchArray[i][j] = false;
            }
        }
    }

    update(elapsed, first = this.grid.getFirstIndex()) { 
        // Check if game over
        // Don't check for game over every update, and don't respawn every update
        if(this.previousIndex !== first) {
            this.previousIndex = first;
            for(let x = 0; x < this.columns; x++) {
                if(this.list[x][(this.rows + this.previousIndex - 1) % this.rows].isVisible) {
                    this.ui.setState("transition");
                    break;
                }
                this.list[x][this.previousIndex].new();
            }
        }

        // Falling animation
        for(let i = this.falling.length -1; i >=0; i--) {
            this.falling[i].y += this.fallSpeed * elapsed;
            if(this.falling[i].y > this.grid.hexHouseHeight * (this.rows - 1)) {
                this.animations.push(new BubbleAnimation(this.falling[i].color.substring(5), this.falling[i].x, this.falling[i].y))
                this.falling.splice(i, 1);
                this.ui.addPoints(5);
            }
        }

        // Cannonballs
        for(let i = 0; i < this.maxCannonballs; i++) {
            if(this.cannonballs[i].isFired) {
                this.cannonballs[i].update(elapsed, this.grid);
                // Cannon ball collision
                // Find falling bubbles if true
                if(this.checkNeighbours(i)) this.findFalling(); 
            }
        }
        
        // Explosion animation
        for(let i = this.animations.length - 1; i >= 0; i--) {
            if(!this.animations[i].update(elapsed)) this.animations.splice(i, 1);
        }
    }

    remove(x, y, pos = this.grid.getTopLeft(x, y)) {
        this.list[x][y].isVisible = false;
        
        this.animations.push(new BubbleAnimation(this.list[x][y].image.substring(5), pos.x, pos.y))
    }

    render(renderer) {        
        
        // Render pop animation
        for(let i = this.animations.length - 1; i >= 0; i--) {
            renderer.drawCenteredOnGrid(this.images[this.animations[i].getCurrentFrame()], this.animations[i], this.grid);
        }
        // Render bubbles
        for(let row = 0; row < this.list[0].length; row++) {
            for(let column = 0; column < this.list.length; column++) {
                const bubble = this.list[column][row];
                if(bubble.isVisible) {
                    renderer.drawOnGrid(this.images[bubble.image], this.grid.getTopLeft(column, row), this.grid);  
                }
            }
        }

        // Render falling bubbles
        this.falling.forEach(fall => 
            renderer.drawOnGrid(this.images[fall.color], fall, this.grid)
        )
          
        // Render next cannonball color
        renderer.draw(this.images[this.cannonballs[(this.cannonballIndex + 1) % this.maxCannonballs].image],  105, 860);

    }
    renderLast(renderer) { 
        // A second round of rendering
        
        // Render cannonball
        this.cannonballs.forEach(cannonball => {
            if(cannonball.isFired) renderer.drawOffGrid(this.images[cannonball.image], { x: cannonball.x,  y: cannonball.y }, this.grid)
        });

        // Render current cannonball color
        renderer.draw(this.images[this.cannonballs[this.cannonballIndex].image],  140, 840, 1.5);
    }

    resetSearch() {
        this.resetSearchArray();
        this.popQueue = [];
        this.connected = 0;
    }

    attachBall(index) {
        
        // prevent overlapping
        if(this.list[this.cannonballs[index].col][this.cannonballs[index].row].isVisible) {
            const bottom = this.grid.getLastIndex();
            while(
                this.list[this.cannonballs[index].col][this.cannonballs[index].row].isVisible
                 && this.cannonballs[index].row !== bottom) {
                    this.cannonballs[index].row = (this.cannonballs[index].row + 1) % this.rows;
                 }
            }
            
        const newBall = this.list[this.cannonballs[index].col][this.cannonballs[index].row];
        newBall.isVisible = true;
        newBall.image = this.cannonballs[index].image;

        // RESET AND FILL
        this.resetSearch();
        this.floodFillnew(this.cannonballs[index].col, this.cannonballs[index].row, this.cannonballs[index].image);
        if(this.connected >= 3) {
            this.popQueue.forEach(pos => this.remove(pos.x, pos.y));
            this.findFalling();  
            this.ui.addPoints(Math.ceil(this.connected * this.connected));   
        }
        this.cannonballs[index].reset(); 
    }

    findFalling() {
        this.resetSearchArray();
        for(let i = 0; i < this.list.length; i++) {
            this.dropFillnew(i, this.grid.getFirstIndex());
        }  
        for(let i = 0; i < this.list.length; i++) {
            for(let j = 0; j < this.list[i].length; j++) {
                if(!this.searchArray[i][j] && this.list[i][j].isVisible) {
                    this.list[i][j].isVisible = false;
                    this.falling.push({
                        ... this.grid.getTopLeft(i, j),  
                        color: this.list[i][j].image,
                    })
                }
            }
        }
    }

    checkCollision(col, row, index) {
        try {
            const check = this.grid.compareCoordsToPos(
                this.cannonballs[index].x + this.grid.radius, 
                this.cannonballs[index].y + this.grid.radius, 
                col, 
                row
            );
            if(this.list[col][row].isVisible && check < this.grid.hexWidth * this.grid.hexWidth) { 
                this.attachBall(index);
                return true;
            }
            return false;
        }
        catch(e) {
            // console.log(e)
            return false;
        }
    }

    checkNeighbours(index) {
        // Only renders plausible collision hexes
        let found = false;

        // get grid position
        this.cannonballs[index].setPos(this.grid.getPosition(this.cannonballs[index].x + this.grid.radius, this.cannonballs[index].y + this.grid.radius));

        if  (this.cannonballs[index].row === this.grid.getFirstIndex()) this.attachBall(index);

        // ABOVE
        found = this.checkCollision(
            this.cannonballs[index].col + (this.cannonballs[index].row % 2 == 0 ? 1 : -1), 
            (this.rows + this.cannonballs[index].row - 1) % this.rows, index);
        if(!found) found = this.checkCollision(
            this.cannonballs[index].col, 
            (this.rows + this.cannonballs[index].row - 1) % this.rows, index);
        // SAME ROW
        if(!found) found = this.checkCollision(
            this.cannonballs[index].col, 
            this.cannonballs[index].row, index);
        if(!found) found = this.checkCollision(
            this.cannonballs[index].col - 1, 
            this.cannonballs[index].row, index);
        if(!found) found = this.checkCollision(
            this.cannonballs[index].col + 1, 
            this.cannonballs[index].row, index);
        // BELOW
        if(!found) found = this.checkCollision(
            this.cannonballs[index].col + (this.cannonballs[index].row % 2 == 0 ? 1 : -1), 
            (this.cannonballs[index].row + 1) % this.rows, index);
        if(!found) found = this.checkCollision(
            this.cannonballs[index].col, 
            (this.cannonballs[index].row + 1) % this.rows, index);
        return found;
    }

    // returns the previous cannonball index
    prevCannonballIndex() {
        if(this.cannonballIndex > 0) return this.cannonballIndex - 1;
        else return this.maxCannonballs - 1;
    }

    fire(cannon) {
        if(!this.cannonballs[this.cannonballIndex].isFired) {

            this.cannonballs[this.cannonballIndex].isFired = true;

            this.cannonballs[this.cannonballIndex].x = cannon.topX + cannon.centerX - this.grid.radius; // THIS IS THE CENTER
            this.cannonballs[this.cannonballIndex].x += Math.sin(cannon.rotation) * cannon.height * .75; // FOR READABILITY            
            
            this.cannonballs[this.cannonballIndex].y = cannon.topY + cannon.centerY - this.grid.radius;
            this.cannonballs[this.cannonballIndex].y -= Math.cos(cannon.rotation) * cannon.height * .75;

            this.cannonballs[this.cannonballIndex].setVelocity(cannon.rotation);

            this.cannonballIndex++;
            this.cannonballIndex %= this.maxCannonballs;
        }
    }

    // screen can now scroll
    dropFillnew(x, y, index = this.grid.getFirstIndex(), endIndex = this.grid.getLastIndex()) {
        const dropFill = (x, y) =>  { 
            // Mark all bubbles connected to the ceiling as true
            // RETURN IF ANY OF THESE ARE TRUE
            if(!this.list[x] || !this.list[x][y] || this.searchArray[x][y] === true || !this.list[x][y].isVisible) return;

            // Mark as parsed
            this.searchArray[x][y] = true;           

            dropFill(x - 1, y);
            dropFill(x + 1, y);

            if(y !== index) {
                dropFill(x, (y + this.rows - 1) % this.rows);
                dropFill(x + (y%2==0 ? 1 : -1), (y + this.rows - 1) % this.rows);
            }
            if(y !== endIndex) {
                dropFill(x, (y + 1) % this.rows);
                dropFill(x + (y%2==0 ? 1 : -1), (y + 1) % this.rows);                    
            }
        }
        dropFill(x, y);
    }

    floodFillnew(x, y, target, index = this.grid.getFirstIndex(), endIndex = this.grid.getLastIndex()) {

        const floodFill = (x, y, target) =>  { 
            // Add all adjacent bubbles of a specific color to the queue
            // This is a recursive function this is a recursive function
            // RETURN IF ANY OF THESE ARE TRUE
            if(!this.list[x] || !this.list[x][y] || this.searchArray[x][y] === true || !this.list[x][y].isVisible) return;

            // Mark as parsed
            this.searchArray[x][y] = true;            

            if(this.list[x][y].image === target) {
                this.connected++; 
                this.popQueue.push({x, y}); 
                floodFill(x - 1, y, target);
                floodFill(x + 1, y, target);

                if(y !== index) {
                    floodFill(x, (y + this.rows - 1) % this.rows, target);
                    floodFill(x + (y%2==0 ? 1 : -1), (y + this.rows - 1) % this.rows, target);
                }
                    
                if(y !== endIndex) {
                    floodFill(x, (y + 1) % this.rows, target);
                    floodFill(x + (y%2==0 ? 1 : -1), (y + 1) % this.rows, target);
                }
            }
            else return;
        }
        floodFill(x, y, target);
    }
}

export default Bubbles;