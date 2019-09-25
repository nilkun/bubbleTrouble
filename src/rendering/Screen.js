export default class Screen {
    constructor(
        width = 800,
        height = 600, 
        canvas = "canvas", 
    ) {
        this.canvas = document.getElementById(canvas);
        this.context = this.canvas.getContext("2d");
        this.canvasName = canvas;
        this.canvas.width = width;
        this.canvas.height = height;

        // For mouse coordinates
        this.rect = this.canvas.getBoundingClientRect();
        this.init();
    }    
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    setBackground(color) {
        this.canvas.style.background = color;
    }
    init() {
        this.canvas.style.background = "#FFAA00";
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    // Returns the current mouse coordinates
    getMouse(event) {
        return { 
            x: event.clientX - this.rect.left, 
            y: event.clientY - this.rect.top 
        };
    }
    getMouseScaled(event, scale) {
        return { 
            x: (event.clientX - this.rect.left) / scale, 
            y: (event.clientY - this.rect.top) / scale 
        };
    }
}