class Debug {
    constructor(isEnabled = false) {
        this.isEnabled = isEnabled;
        this.minDistance = Math.cos(Math.PI / 6) / 2;
    }

    toggle(){
        this.isEnabled = !this.isEnabled;
        console.log("Debug mode", this.isEnabled ? "on." : "off.") 
    }

    click(bubbles, grid, renderer) {
        try { 
            console.log("Popping a bubble.")
            bubbles.pop(renderer.mouse.col, renderer.mouse.row)        }
        catch(e) {
            console.log("No bubble.")
        }
    }
    
    followCrosshair(grid, renderer, color = "#88888899") { 
        let pos = grid.getPosition(renderer.mouse.x, renderer.mouse.y)       
        let offset = pos.row % 2 == 0 ? 1 : -1;
        
        // Above
        grid.fillOne(pos.col + offset, pos.row - 1, color, renderer.context, renderer.scale);
        grid.fillOne(pos.col, pos.row - 1, color, renderer.context, renderer.scale);

        grid.fillOne(pos.col + 1, pos.row, color, renderer.context, renderer.scale);
        grid.fillOne(pos.col - 1, pos.row, color, renderer.context, renderer.scale);
        
        grid.fillOne(pos.col + offset, pos.row + 1, color, renderer.context, renderer.scale);
        grid.fillOne(pos.col, pos.row + 1, color, renderer.context, renderer.scale);
    }

    do(renderer, assets, cannon, grid, bubbles, elapsedTime) {

        // Fills a hexagon
        // grid.fillOne(4, 3, "blue", renderer.context);

        // Show mouse shadow
        renderer.mouse.update(grid.getPosition(renderer.mouse.x, renderer.mouse.y));        
        grid.fillOne(renderer.mouse.col, renderer.mouse.row, "#555555AA", renderer.context, renderer.scale);

        // Show mouse neighbours
        this.followCrosshair(grid, renderer);

        // Increase readability
        renderer.drawRect(0, 900, 768, 124, "#555555CC");

        // Show coordinates
        renderer.write(renderer.mouse.col + " x " + renderer.mouse.row, 20, 1000, 36);
        // Show mouse position
        renderer.write(renderer.mouse.x.toFixed(0) + " x " + renderer.mouse.y.toFixed(0), 20, 950, 36);
        // Show framerate
        renderer.write(Math.round(1000 / elapsedTime) + " fps", 650, 1000, 36);           
        // Show degrees
        renderer.write(Math.round(cannon.rotation * 180 / Math.PI * 10) / 10 + "°", 650, 950, 36)
    }
}

export default Debug;