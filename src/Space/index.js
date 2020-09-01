import * as PIXI from 'pixi.js';
import Planet from './Planet/Planet';

export default class Space {
  constructor() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1
    });
    this.planets = [];
    this.planetAmount = 2000;
  }

  init() {
    document.getElementById('canvas').appendChild(this.app.view);
    this.drawPlanets();
    this.drawSun();
    this.animate();
  }

  drawSun() {
    const sunCoordinates = {
      x: this.app.screen.width * 0.5,
      y: this.app.screen.height * 0.5
    };

    this.sun = new Planet(
      sunCoordinates.x,
      sunCoordinates.y,
      100,
      0xf2cc59,
      0.6
    );
    const sunLight = new Planet(
      sunCoordinates.x,
      sunCoordinates.y,
      104,
      0xffffff,
      0.9
    );
    this.app.stage.addChild(sunLight, this.sun);
  }

  drawPlanets() {
    for (let index = 0; index < this.planetAmount; index++) {
      const deg = Math.random() * Math.PI * 2;
      const distance = Math.floor(Math.random() * this.app.screen.height) + 100;
      const planetCoordinates = {
        x: this.app.screen.width * 0.5 + Math.cos(deg),
        y: this.app.screen.height * 0.5 + Math.sin(deg)
      };
      const planetSize = Math.floor(Math.random() * 2) + 1;
      const planetLight = parseFloat(Math.random().toFixed(2));
      const planet = new Planet(
        planetCoordinates.x,
        planetCoordinates.y,
        planetSize,
        0xffffff,
        planetLight
      );
      this.app.stage.addChild(planet);
      this.planets.push({
        graphics: planet,
        initialAngle: deg,
        distance: distance,
        speed: Math.floor(Math.random() * 10) + 1
      });
    }
  }

  drawLine(x, y) {
    for (let index = 0; index < this.planets.length; index++) {
      const planet = this.planets[index];
      const path = new PIXI.Graphics();
      path.lineStyle(1, 0xffffff, 1);
      path.moveTo(this.app.screen.width / 2, this.app.screen.height / 2);
      path.lineTo(x, y);

      this.app.stage.addChild(path);
    }
  }

  animate() {
    let count = 0;
    this.app.ticker.add((delta) => {
      this.planets.forEach((planet, index) => {
        if (index === 0) {
        }
        const { graphics, initialAngle, distance, speed } = planet;
        count += speed / (this.planetAmount * 10000);
        const newPosX = Math.cos(initialAngle + count) * distance;
        const newPosY = Math.sin(initialAngle + count) * distance;
        graphics.transform.position.x = newPosX;
        graphics.transform.position.y = newPosY;
      });
    });
  }
}
