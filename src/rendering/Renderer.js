import Screen from "./Screen.js"

// Functions for drawing to the screen, and handling mouse position
class Mouse {
    constructor() {
        this.x = 0; 
        this.y = 0;  
        this.row = 0;    
        this.col = 0; 
    }    
    set(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
    update(grid) {
        this.col = grid.col;
        this.row = grid.row;
        this.localX = grid.localX;
        this.localY = grid.localY
    } 
}
export default class Renderer {
    constructor() {
        this.scale = .75;        
        this.screen = new Screen(768 * this.scale, 1024 * this.scale);
        this.context = this.screen.context;
        this.mouse = new Mouse();
        this.defaultColor = "white"
    }

    // Scales and draws
    draw(image, x, y, scale = 1, context = this.context) {
        context.drawImage(image, x * this.scale, 
            y * this.scale, 
            Math.ceil(image.width * this.scale * scale), 
            Math.ceil(image.height * this.scale * scale)
        );
    }

    drawOnGrid(image, pos, grid) {
        this.context.drawImage(
            image, 
            pos.x * this.scale, 
            (pos.y % grid.gridHeight) * this.scale, 
            Math.ceil(grid.hexWidth * this.scale), 
            Math.ceil(grid.hexWidth * this.scale)
        );
    }

    drawCenteredOnGrid(image, pos, grid) {
        this.context.drawImage(
            image, 
            (pos.x) * this.scale, 
            (pos.y % grid.gridHeight) * this.scale, 
            Math.ceil(grid.hexWidth * this.scale), 
            Math.ceil(grid.hexWidth * this.scale)
        );
    }

    drawOffGrid(image, pos, grid) {
        this.context.drawImage(
            image, 
            pos.x * this.scale, 
            pos.y  * this.scale, 
            Math.ceil(grid.hexWidth * this.scale), 
            Math.ceil(grid.hexWidth * this.scale)
        );
    }

    drawGrid(grid) {
        this.context.drawImage(
            grid.image, 
            0, 
            (-grid.edge * 4.5 * this.scale) + (grid.yMovement % (grid.edge * 3)) * this.scale,
            Math.ceil(grid.image.width * this.scale), 
            Math.ceil(grid.image.height * this.scale) 
        );
    }

    drawLine(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.moveTo(x1 * this.scale, y1 * this.scale);
        this.context.lineTo(x2 * this.scale, y2 * this.scale);
        this.context.stroke();
    }

    drawRect(x1, y1, x2, y2, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x1 * this.scale, y1 * this.scale, x2 * this.scale, y2 * this.scale);
        this.context.fillStyle = this.defaultColor;
    }

    // Rotates, scales and draws
    drawRotated(image, x, y, centerX, centerY, rotation) {
        this.context.save();
        this.context.translate((x + centerX) * this.scale, (y + centerY)*this.scale);
        this.context.rotate(rotation)

        this.context.drawImage(image, -centerX * this.scale, -centerY * this.scale, Math.ceil(image.width * this.scale), Math.ceil(image.height * this.scale))
        this.context.restore();
    }

    write(text, x, y, size) {
        this.context.font = size * this.scale + "px Arial";
        this.context.fillStyle = "white"
        this.context.strokeText(text, x * this.scale, y * this.scale);
        this.context.fillText(text, x * this.scale, y * this.scale);
    }

    writeCentered(text, y, size, color = "white", strokeColor = "grey", context = this.context, x = context.canvas.width / 2) {
        context.font = size * this.scale + "px Arial";
        context.textAlign = "center"
        context.fillStyle = color;
        context.strokeStyle = strokeColor;
        context.strokeText(text, x, y * this.scale);
        context.fillText(text, x, y * this.scale);
        context.textAlign = "start";
    }
}