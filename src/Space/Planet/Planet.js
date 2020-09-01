import { Graphics } from 'pixi.js'

export default class Planet extends Graphics {
    constructor(px, py, radius, color) {
        super();
        this.px = px;
        this.py = py;
        this.radius = radius;
        this.color = color;
        this.draw();
    }

    draw() {
        this.lineStyle(0);
        this.beginFill(this.color, 1);
        this.drawCircle(this.px, this.py, this.radius);
        this.endFill();
    }
}