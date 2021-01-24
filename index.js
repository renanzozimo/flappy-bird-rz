console.log('Flappy Bird - Renan Zózimo');
console.log('https://www.renanzozimo.github.io');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  width: 33,
  height: 24,
  x: 10,
  y: 50,
  gravity: .25,
  speed: 0,
  update() {
    this.speed = this.speed + this.gravity;
    this.y = this.y + this.speed
  },
  draw(ctx) {
    ctx.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      this.x, this.y,
      this.width, this.height
    );
  }
}

const floor = {
  spriteX: 0,
  spriteY: 610,
  width: 223,
  height: 112,
  x: 0,
  y: canvas.height - 112,
  draw(ctx) {
    ctx.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      this.x, this.y,
      this.width, this.height
    );
    ctx.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      (this.x + this.width), this.y,
      this.width, this.height
    );
  }
}

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw(ctx) {

    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      this.x, this.y,
      this.width, this.height
    );
    ctx.drawImage(
      sprites,
      this.spriteX, this.spriteY,
      this.width, this.height,
      (this.x + this.width), this.y,
      this.width, this.height
    );
  }
}

function loop() {

  flappyBird.update();

  background.draw(context);
  floor.draw(context);
  flappyBird.draw(context);

  requestAnimationFrame(loop);
}

loop();