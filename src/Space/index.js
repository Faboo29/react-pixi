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
    this.app.stage.sortableChildren = true;
  }

  init() {
    document.getElementById('canvas').appendChild(this.app.view);
    this.drawPlanets();
    this.drawBigPlanet();
    this.drawSun();
    this.animate();
  }

  drawSun() {
    const sunCoordinates = {
      x: this.app.screen.width * 0.5,
      y: this.app.screen.height * 0.5
    };
    const sunSize = 200;

    /**
     * Draw two sections of the sun to play
     * with container's z-indexes
     */
    this.sunBack = new PIXI.Container();
    this.sunFront = new PIXI.Container();
    this.sunBack.name = 'sun-back';
    this.sunFront.name = 'sun-front';

    const sunBackGraphics = this.drawHalfSun(
      sunCoordinates.x,
      sunCoordinates.y,
      sunSize,
      0,
      Math.PI,
      0xf2cc59
    );
    const sunBackLightGraphics = this.drawHalfSun(
      sunCoordinates.x,
      sunCoordinates.y,
      sunSize * 1.04,
      0,
      Math.PI,
      0xffffff
    );
    const sunFrontGraphics = this.drawHalfSun(
      sunCoordinates.x,
      sunCoordinates.y,
      sunSize,
      Math.PI,
      0,
      0xf2cc59
    );
    const sunFrontLightGraphics = this.drawHalfSun(
      sunCoordinates.x,
      sunCoordinates.y,
      sunSize * 1.04,
      Math.PI,
      0,
      0xffffff
    );

    this.sunBack.addChild(sunBackLightGraphics, sunBackGraphics);
    this.sunFront.addChild(sunFrontLightGraphics, sunFrontGraphics);
    this.sunFront.zIndex = 20;
    this.app.stage.addChild(this.sunFront, this.sunBack);
  }

  drawHalfSun(x, y, radius, startAngle, endAngle, fill) {
    let semiArc = new PIXI.Graphics();
    semiArc = semiArc.beginFill(fill);
    semiArc.lineStyle(0);
    semiArc.arc(x, y, radius, startAngle, endAngle);
    return semiArc;
  }

  drawBigPlanet() {
    this.earthContainer = new PIXI.Container();
    this.earthContainer.name = 'earth';
    this.earthContainer.zIndex = 10;
    const distance = 350;
    const deg = Math.random() * Math.PI * 2;
    const coordinates = {
      x: this.app.screen.width * 0.5 + Math.cos(deg),
      y: this.app.screen.height * 0.5 + Math.sin(deg)
    };
    const bigPlanet = new Planet(coordinates.x, coordinates.y, 20, 0x3e1be4, 1);
    const ellipsePath = new PIXI.Graphics();
    ellipsePath.lineStyle(4, 0xffffff, 0.4);
    ellipsePath.drawEllipse(
      this.app.screen.width * 0.5,
      this.app.screen.height * 0.5,
      distance,
      distance * 0.16
    );
    ellipsePath.endFill();

    this.earthContainer.addChild(ellipsePath, bigPlanet);
    this.app.stage.addChild(this.earthContainer);
    this.bigPlanet = {
      graphics: bigPlanet,
      initialAngle: deg,
      distance: distance
    };
  }

  drawPlanets() {
    this.starContainer = new PIXI.Container();
    this.starContainer.name = 'starContainer';
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
      this.starContainer.addChild(planet);
      this.planets.push({
        graphics: planet,
        initialAngle: deg,
        distance: distance,
        speed: Math.floor(Math.random() * 10) + 1
      });
    }

    this.app.stage.addChild(this.starContainer);
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
    let starCount = 0;
    let bigPlanetCount = 0;
    let earthIndex = 100;
    console.log(this.app.stage.children);
    this.app.ticker.add((delta) => {
      /**
       * Rotate stars around the sun
       */
      this.planets.forEach((planet) => {
        const { graphics, initialAngle, distance, speed } = planet;
        starCount += speed / (this.planetAmount * 10000);
        const newPosX = Math.cos(initialAngle + starCount) * distance;
        const newPosY = Math.sin(initialAngle + starCount) * distance;
        graphics.transform.position.x = newPosX;
        graphics.transform.position.y = newPosY;
      });

      /**
       * Rotate big planet
       */
      const { graphics, initialAngle, distance } = this.bigPlanet;
      bigPlanetCount += 0.01;
      const newPosX = Math.cos(initialAngle + bigPlanetCount) * distance;
      const newPosY =
        Math.sin(initialAngle + bigPlanetCount) * (distance * 0.16);

      graphics.transform.position.x = newPosX;
      graphics.transform.position.y = newPosY;
      const isBehind = Math.sin(initialAngle + bigPlanetCount) < 0;
      // earthIndex = isBehind ? 0 : 100;
      // this.earthContainer.zIndex = earthIndex;
    });
  }
}
