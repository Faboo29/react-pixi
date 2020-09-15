import * as PIXI from 'pixi.js';
import Planet from './Planet/Planet';
import planets from './Planet/planets.json';

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
    this.bigPlanets = [];
  }

  init() {
    document.getElementById('canvas').appendChild(this.app.view);
    this.drawPlanets();
    // this.drawBigPlanet();
    this.bigPlanetContainer = new PIXI.Container();
    this.bigPlanetContainer.name = 'bigPlanets';
    this.bigPlanetContainer.zIndex = 10;
    planets.forEach((planet) => {
      this.drawBigPlanet(planet);
    });
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

  drawBigPlanet(planet) {
    const deg = Math.random() * Math.PI * 2;
    const coordinates = {
      x: this.app.screen.width * 0.5 + Math.cos(deg),
      y: this.app.screen.height * 0.5 + Math.sin(deg)
    };
    const bigPlanet = new Planet(
      coordinates.x,
      coordinates.y,
      planet.size,
      PIXI.utils.string2hex(planet.color),
      1
    );

    // ELLIPSE
    const ellipsePath = new PIXI.Graphics();
    ellipsePath.lineStyle(
      1000 / planet.distance,
      PIXI.utils.string2hex(planet.color),
      0.3
    );
    ellipsePath.drawEllipse(
      this.app.screen.width * 0.5,
      this.app.screen.height * 0.5,
      planet.distance,
      planet.distance * this.getEllipseYRatio(planet.distance)
    );
    ellipsePath.endFill();
    const planetContainer = new PIXI.Container();
    planetContainer.addChild(ellipsePath, bigPlanet);
    this.bigPlanetContainer.addChild(planetContainer);
    this.app.stage.addChild(this.bigPlanetContainer);
    this.bigPlanets.push({
      graphics: bigPlanet,
      initialAngle: deg,
      distance: planet.distance,
      yPerspective: this.getEllipseYRatio(planet.distance),
      speed: planet.speed
    });
  }

  getColor(color) {
    return parseInt(color.substring(1), 16);
  }

  getEllipseYRatio(distance) {
    return 100 / distance;
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
        speed: Math.floor(Math.random() * 3) + 1
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
    let bigPlanetPosition = 0;
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
      this.bigPlanets.forEach((planet) => {
        const { graphics, initialAngle, distance, yPerspective } = planet;
        bigPlanetPosition += 0.28 / distance;
        const newPosX = Math.cos(initialAngle + bigPlanetPosition) * distance;
        const newPosY =
          Math.sin(initialAngle + bigPlanetPosition) *
          (distance * yPerspective);

        graphics.transform.position.x = newPosX;
        graphics.transform.position.y = newPosY;
      });
    });
  }
}
