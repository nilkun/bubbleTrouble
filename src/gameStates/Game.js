import HexagonGrid from "../gameObjects/HexagonGrid.js"
import Cannon from "../gameObjects/Cannon.js"
import Bubbles from "../gameObjects/Bubbles.js"
import Renderer from "../rendering/Renderer.js"
import Debug from "../helpers/Debug.js"
import Events from "../helpers/Events.js"
import UI from "../rendering/UI.js"
import States from "./States.js"

export default class Game extends States {
    constructor(assets) {

        super();
        this.assets = assets; // Store the assets
        // Create event handler
        this.events = new Events;
        // Create renderer
        this.renderer = new Renderer;  
        // grid toggle boolean
        this.gridIsOn = false;
              
        // User Interface
        this.ui = new UI(this);
        this.startGame();
    }

    // Dirty restart to play again
    restart(cols, rows, speed) {
        // Create renderer
        this.renderer = new Renderer;  
              
        // User Interface and grid
        this.ui = new UI(this, speed);
        this.ui.gameSpeed = speed;
        this.ui.score = 0;

        this.grid = new HexagonGrid(
                this.gridIsOn,
                this.ui, 
                this.renderer.screen.canvas.width / this.renderer.scale,   // Screen width in real size
                85,             // Crop from side
                cols,                 // columns
                rows,        // rows
                this.assets.image["ball_blue"].width * this.renderer.scale); // The radius of a bubble
                
        // Game objects
        this.cannon = new Cannon(this.assets.image["cannon_base"], this.assets.image["cannon_top"])
        this.bubbles = new Bubbles(this.assets, this.renderer, this.grid, this.ui, cols, rows); 
        // debug data
        this.debug = new Debug;
    }

    createEvents() {
        this.events.add("mousemove", (e) => {
            this.renderer.mouse.set(this.renderer.screen.getMouseScaled(e, this.renderer.scale));
            if(this.name === "play") {
                this.cannon.setRotation(this.renderer.mouse); // Cannon follows mouse pointer
            }

        }); 
        this.events.add("click", () => {
            switch(this.name) {
                case "play":
                    if(this.debug.isEnabled) this.debug.click(this.bubbles, this.grid, this.renderer)  ; 
                    this.bubbles.fire(this.cannon);
                    break;

                case "start":
                    this.ui.handleStartInput();
                    break;

                case "game over":
                    if(this.time > 1000) this.ui.setState("start");
                    break;
            }
            
        });
        this.events.add("keypress", (e) => this.events.handle(e, this.debug, this.grid));
    }    
    
    startGame() {

        this.createEvents();
        
        // Remove mouse cursor
        document.getElementById("canvas").style.cursor = "none";

        // Initialize elapsedTime;
        let previousTime = 0;
        let elapsedTime = 0;
    
        this.ui.setState("start");
        
        window.requestAnimationFrame(this.current);
    }
}
