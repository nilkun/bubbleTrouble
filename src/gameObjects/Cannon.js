export default class Cannon {
    constructor(base, top) {
        this.base = base;
        this.top = top;
        this.baseX = (768 - base.width) / 2;
        this.baseY = 870
        this.topX = (768 - top.width) / 2;
        this.topY = 790;
        this.centerX = top.width / 2;
        this.centerY = top.height * .75;
        this.height = top.height * .75;
        this.rotation = 0;
        this.cooldownPeriod = 50;
    }

    render(renderer) {
        renderer.draw(this.base, this.baseX, this.baseY);
        renderer.drawRotated(this.top, this.topX, this.topY, this.centerX, this.centerY, this.rotation);
    }


    setRotation(mousePos) {
        const x = mousePos.x - (this.topX + this.centerX);
        const y = mousePos.y - (this.topY + this.centerY);

        // Limit how much the top can be rotated
        // Just decrease y to limit rotation
        if(Math.abs(x) > 384 || y < -800 || x > 768 || y >= -50) return;
        this.rotation = Math.atan(x / -y)

    }
}