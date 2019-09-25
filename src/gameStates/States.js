// All the game states

export default class States {
    constructor() {
        this.elapsedTime = 0;
        this.previousTime = 0;
        this.time = 0;
        this.current;
        this.name;
        this.names = ["play", "game over", "start", "transition"];
    }
    set(state) {
        this.time = 0;
        const idx = this.names.indexOf(state);        
        switch(idx) {
            case 0:
                this.current = this.play.bind(this);
                this.name = this.names[idx];
                break;
            case 1:
                this.current = this.gameOver.bind(this);
                this.name = this.names[idx];
                break;
            case 2:
                this.current = this.startScreen.bind(this);
                this.name = this.names[idx];
                break;
            case 3: 
                this.current = this.transition.bind(this);
                this.name = this.names[idx];
                break;
            default:
                console.log("No such state:", state);
        }
    }
    
    play(currentTime) {
        // Update elapsed time
        this.elapsedTime = currentTime - this.previousTime;
        this.previousTime = currentTime;

        //Update
        this.grid.update(this.elapsedTime);
        this.bubbles.update(this.elapsedTime);
        
        //Render
        this.renderer.draw(this.assets.image["bg1_center"], 0, 0) // Background
 
        this.bubbles.render(this.renderer, this.grid.index);

        this.renderer.draw(this.assets.image["bg1_header"], 0, 0);

        this.grid.render(this.renderer); // Renders grid if switched on
        this.cannon.render(this.renderer);
        this.ui.render(this.renderer);
        this.bubbles.renderLast(this.renderer);

        //DEBUG
        this.debug.isEnabled && this.debug.do(this.renderer, this.assets, this.cannon, this.grid, this.bubbles, this.elapsedTime);

        this.renderer.draw(this.assets.image["crosshair"], this.renderer.mouse.x - 27, this.renderer.mouse.y - 27);
        window.requestAnimationFrame(this.current);
    }

    transition(currentTime) {
        // prevent leaving the game over screen immediately
        this.elapsedTime = currentTime - this.previousTime;
        this.previousTime = currentTime;
        this.time += this.elapsedTime;
        if(this.time > 1000) this.ui.setState("game over")

        this.renderer.writeCentered("GAME OVER!!", 350, 95);
        this.renderer.context.beginPath();
        this.renderer.context.fillStyle = "#0000000f";
        this.renderer.context.fillRect(0, 0, this.renderer.context.canvas.width, this.renderer.context.canvas.height);
        window.requestAnimationFrame(this.current);
    }

    gameOver(currentTime) {
        this.elapsedTime = currentTime - this.previousTime;
        this.previousTime = currentTime;
        this.time += this.elapsedTime;

        this.renderer.context.beginPath();
        this.renderer.context.fillStyle = "black";
        this.renderer.context.fillRect(0, 0, this.renderer.context.canvas.width, this.renderer.context.canvas.height);
        this.renderer.writeCentered("GAME OVER!!", 350, 95);
        this.renderer.writeCentered("Final score: " + this.ui.score, 425, 45);
        this.renderer.writeCentered("Click to restart", 625, 45);
        this.renderer.draw(this.assets.image["crosshair"], this.renderer.mouse.x - 27, this.renderer.mouse.y - 27);
        window.requestAnimationFrame(this.current);
    }

    startScreen(currentTime) {
        // Update elapsed time
        this.elapsedTime = currentTime - this.previousTime;
        this.previousTime = currentTime;

        this.renderer.screen.clear();
        this.renderer.context.drawImage(this.ui.startScreen, 0, 0);
        this.ui.renderSelected();
        this.renderer.draw(this.assets.image["crosshair"], this.renderer.mouse.x - 27, this.renderer.mouse.y - 27);
        window.requestAnimationFrame(this.current);
    }
}