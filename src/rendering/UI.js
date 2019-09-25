const difficultyLevels = [
    [7, 12],
    [9, 16],
    [11, 18],
];

const speedLevels = [
    0.0001,
    0.0005,
    0.00075
]

class Button {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

// Creating UI elements and setting state and scoring
export default class UI {
    constructor(parent, speed) {
        this.infoScreen;
        this.nextBall;
        this.score = 0;
        this.parent = parent
        this.gameSpeed = speed;

        this.options = {
            difficulty: 1,
            speed: 1,
        }

        this.nextCannonball = this.createRoundedRectangle(190, 140, 30, "#33333355");
        this.scoreboard = this.createRoundedRectangle(220, 140, 30, "#33333388");

        this.startButton = this.createRoundedRectangle(200, 200, 200, 200, "FFFF0055");

        this.startMenu = { }
        this.buttons = [];
        this.startScreen = this.createStartScreen();
    }

    setState(state) {
        this.parent.set(state);
        
    }

    createRoundedRectangle(w, h, radius, color = "black") {
        const context = document.createElement("canvas").getContext("2d");
        context.canvas.width = w;
        context.canvas.height = h;
        context.fillStyle = color;
        context.imageSmoothingEnabled = false;

        context.arc(radius, radius, radius, Math.PI, Math.PI * 1.5)
        context.lineTo(w - radius, 0);
        context.arc(w - radius, radius, radius, Math.PI * 1.5, Math.PI * 2);

        context.lineTo(w, h - radius);
        context.arc(w - radius, h - radius, radius, 0, Math.PI * .5)

        context.lineTo(0 + radius, h);
        context.arc(radius, h - radius, radius, Math.PI * .5, Math.PI)

        context.fill();        
        return context.canvas;
    }

    createTextBox(text, context, x,  padding, paddingTop, fontSize) {        
        context.beginPath();   
        context.font = fontSize + "px Arial";
        const textWidth = context.measureText(text).width;  
        const width = textWidth + padding * 2;
        const height = context.canvas.height; 
        context.fillStyle = "#aa8855";

        context.fillRect(
            x,
            0, 
            width,
            height);

        context.beginPath();
        context.fillStyle = "#cccccc";
        context.fillText(text, x + padding, fontSize + paddingTop * .75);
        this.buttons.push(new Button(x, 0, width, height))
        return x + width + padding;
    }

    createButtonRow(buttons, xOff = 0, yOff = 0, padding = 20, paddingTop = 20, fontSize = 30) {
        
        let context = document.createElement("canvas").getContext("2d");

        context.canvas.height = fontSize + paddingTop * 2; 
        context.canvas.width = 768;
        context.font = fontSize + "px Arial";

        let x = 0;
        buttons.forEach(button => x = this.createTextBox(button, context, x, padding, paddingTop, fontSize))

        const c = document.createElement("canvas").getContext("2d")
        c.canvas.width = x - padding;
        c.canvas.height = context.canvas.height;
        c.drawImage(context.canvas, 0, 0);
        for(let i = this.buttons.length - buttons.length; i < this.buttons.length; i++) {
            this.buttons[i].x += xOff;
            this.buttons[i].y = yOff;
        }
        return c.canvas;
    }

    isOnButton({x, y, width, height}, mouse = this.parent.renderer.mouse) {
        if(mouse.x > x && mouse.x < x + width && mouse.y > y && mouse.y < y + height) return true;
        return false;
    }

    handleStartInput() {
        for(let i = 0; i < this.buttons.length; i++) {
            if(this.isOnButton(this.buttons[i])) {
                if(i < 3) this.options.difficulty = i;
                else if(i < 6) this.options.speed = i - 3;
                else {
                    this.parent.restart(
                        difficultyLevels[this.options.difficulty][0],
                        difficultyLevels[this.options.difficulty][1],
                        speedLevels[this.options.speed]
                    );
                    this.setState("play");
                    break;
                }
            }
        }
    }

    renderSelected(elapsedTime) {
        this.parent.renderer.context.strokeStyle = "#225522"
        this.parent.renderer.context.lineWidth = 3;
        this.parent.renderer.context.strokeRect(
            this.buttons[this.options.difficulty].x * this.parent.renderer.scale, 
            this.buttons[this.options.difficulty].y * this.parent.renderer.scale,
            this.buttons[this.options.difficulty].width * this.parent.renderer.scale,
            this.buttons[this.options.difficulty].height * this.parent.renderer.scale)


        this.parent.renderer.context.strokeRect(
            this.buttons[this.options.speed + 3].x * this.parent.renderer.scale, 
            this.buttons[this.options.speed + 3].y * this.parent.renderer.scale,
            this.buttons[this.options.speed + 3].width * this.parent.renderer.scale,
            this.buttons[this.options.speed + 3].height * this.parent.renderer.scale)

        this.parent.renderer.context.lineWidth = 1;
        
        for(let i = 0; i < this.buttons.length; i++) {
            if(this.isOnButton(this.buttons[i])) {
                this.parent.renderer.context.beginPath();
                this.parent.renderer.context.fillStyle = "#00000055"
                this.parent.renderer.context.fillRect(
                    this.buttons[i].x * this.parent.renderer.scale, 
                    this.buttons[i].y * this.parent.renderer.scale, 
                    this.buttons[i].width * this.parent.renderer.scale, 
                    this.buttons[i].height * this.parent.renderer.scale);
                break;
            }
        }          
    }

    createStartScreen() {
        const context = document.createElement("canvas").getContext("2d");
        context.canvas.width = this.parent.renderer.context.canvas.width;
        context.canvas.height = this.parent.renderer.context.canvas.height;

        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                context.drawImage(this.parent.assets.image["ball_green"], 
                i * this.parent.assets.image["ball_green"].width, 
                j * this.parent.assets.image["ball_green"].height,
                );
            }
        }
        context.beginPath();
        context.fillStyle = "#555555aa";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        this.parent.renderer.writeCentered("Bubble Trouble", 250, 95, "#cccccc", "#aa8855", context);
        this.parent.renderer.writeCentered("A bubble shooter", 300, 35, "#cccccc", "#aa8855", context);
        this.parent.renderer.writeCentered("Use the mouse to aim and fire, <g> toggles the grid.", 375, 30, "#dfdfdf", "#aa8855", context);
       
        const position = 450;
        const difficulty = this.createButtonRow(
            [ "small", "medium", "large" ],
            0, position,
        );
        const speed = this.createButtonRow(
            [ "slow", "normal", "fast" ],
            0, position + 100, 
            32, 20
        );
        const start = this.createButtonRow(
            [ "start" ],
            0, position + 200,
            200, 25, 60
        );

        let w1 = 0; let w2 = 0;
        for(let i = 0; i < 3; i++) {
            this.buttons[i].x = w1; w1 += this.buttons[i].width + 20;
            this.buttons[i + 3].x = w2; w2 += this.buttons[i + 3].width + 32;
        }
        const dPos = (768 - w1 + 20) / 2;
        const sPos = (768 - w2 + 32) / 2;

        for(let i = 0; i < 3; i++) {
            this.buttons[i].x += dPos;
            this.buttons[i + 3].x += sPos;
        }

        this.buttons[this.buttons.length -1].x = (768 - start.width) / 2;

        context.drawImage(difficulty, 
            dPos * this.parent.renderer.scale, 
            this.buttons[0].y * this.parent.renderer.scale, 
            difficulty.width * this.parent.renderer.scale, 
            difficulty.height * this.parent.renderer.scale);

        context.drawImage(speed, 
                sPos * this.parent.renderer.scale, 
                this.buttons[3].y * this.parent.renderer.scale, 
                speed.width * this.parent.renderer.scale, 
                speed.height * this.parent.renderer.scale);

        context.drawImage(start, 
            this.buttons[6].x * this.parent.renderer.scale, 
            this.buttons[6].y * this.parent.renderer.scale, 
            start.width * this.parent.renderer.scale, 
            start.height * this.parent.renderer.scale);

        return context.canvas;
    }

    addPoints(score) {
        this.score += score;
    }

    setNextBall(color) {
        this.currentBall = nextBall
        this.nextBall = color;
    }

    render(renderer) {
        renderer.draw(this.nextCannonball, 90, 830);
        renderer.draw(this.scoreboard, 490, 830);

        renderer.writeCentered("your score:", 865, 25, "white", "black", renderer.context, 600 * renderer.scale); 
        renderer.writeCentered(this.score, 925, 55, "white", "black", renderer.context, 600 * renderer.scale);
    }
}