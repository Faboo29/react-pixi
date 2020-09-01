import { Graphics } from 'pixi.js';

export default class Planet extends Graphics {
  constructor(px, py, radius, color, light) {
    super();
    this.px = px;
    this.py = py;
    this.radius = radius;
    this.color = color;
    this.light = light;
    this.draw();
  }

  draw() {
    this.lineStyle(0);
    this.beginFill(this.color, this.light);
    this.drawCircle(this.px, this.py, this.radius);
    this.endFill();
  }
}
