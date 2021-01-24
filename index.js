console.log('Flappy Bird - Renan Zózimo');
console.log('https://www.renanzozimo.github.io');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const flappyBird = {
  sX: 0,
  sY: 0,
  w: 33,
  h: 24,
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
      this.sX, this.sY,
      this.w, this.h,
      this.x, this.y,
      this.w, this.h
    );
  }
}

const floor = {
  sX: 0,
  sY: 610,
  w: 223,
  h: 112,
  x: 0,
  y: canvas.height - 112,
  draw(ctx) {
    ctx.drawImage(
      sprites,
      this.sX, this.sY,
      this.w, this.h,
      this.x, this.y,
      this.w, this.h
    );
    ctx.drawImage(
      sprites,
      this.sX, this.sY,
      this.w, this.h,
      (this.x + this.w), this.y,
      this.w, this.h
    );
  }
}

const background = {
  sX: 390,
  sY: 0,
  w: 275,
  h: 204,
  x: 0,
  y: canvas.height - 204,
  draw(ctx) {

    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      sprites,
      this.sX, this.sY,
      this.w, this.h,
      this.x, this.y,
      this.w, this.h
    );
    ctx.drawImage(
      sprites,
      this.sX, this.sY,
      this.w, this.h,
      (this.x + this.w), this.y,
      this.w, this.h
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