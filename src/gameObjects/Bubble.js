// The Cannonball class extends Bubble and gives it some extra properties,
// The left and right walls are hardcoded into the cannonball class

class Bubble {
    constructor(bubble) {
        this.new(bubble);
    }
        
    // Returns a random color
    getColor() {
        return ["blue", "green", "purple", "red", "yellow"][Math.floor(Math.random() * 5)];
    }
    new(color = this.getColor()) {
        this.isVisible = true;
        this.image = "ball_" + color;
    }
}

class Cannonball extends Bubble {
    constructor(x, y, width) {
        super();
        this.x = x;
        this.y = y;
        this.col = -100;
        this.row = -100;
        this.width = width;
        this.image = "ball_" + this.getColor(); 
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.speed = .25; 
        this.isFired = false;   
    }

    reset() {
        this.isFired = false;
        this.image = "ball_" + this.getColor();
        this.x = -100;
        this.y = -100;
        this.col = -100;
        this.row = -100;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    setVelocity(rotation) {
        this.velocity.x = Math.sin(rotation);
        this.velocity.y = -Math.cos(rotation);
    }

    setPos(position) {
        this.col = position.col;
        this.row = position.row;
    }

    update(elapsed, grid) {
        if(this.isFired) {
            this.x += this.velocity.x * elapsed * this.speed;
            this.y += this.velocity.y * elapsed * this.speed;
            
            // The tree stems
            if(this.x < 85 || this.x + this.width >= 683) this.velocity.x = -this.velocity.x;
        }
    }
}

class BubbleAnimation {
    constructor(color, x, y, frames = ["round_", "gleam_"]) {
        this.x = x;
        this.y = y;
        this.frames = frames;
        this.color = color;
        this.playbackSpeed = .003;
        this.currentFrame = 0;
    }
    getCurrentFrame() {
        return this.frames[Math.floor(this.currentFrame)] + this.color;
    }
    update(elapsedTime) {
        this.currentFrame += elapsedTime * this.playbackSpeed;
        if(this.currentFrame > this.frames.length) {
            this.currentFrame = 0;
            return false;
        }
        return true;
    }
}

export { Bubble, Cannonball, BubbleAnimation };