console.log('Flappy Bird - Renan Zózimo');
console.log('https://www.renanzozimo.github.io');

let frames = 0;
const sprites = new Image();
sprites.src = './sprites.png';

const hitSound = new Audio();
hitSound.src = './effects/hit.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function createFlappyBird() {
  return {
    sX: 0,
    sY: 0,
    w: 33,
    h: 24,
    x: 10,
    y: 50,
    gravity: .25,
    speed: 0,
    jumpForce: 4.6,
    collidingBottom(target) {
      return this.y + this.h >= target.y
    },
    jump() {
      this.speed = - this.jumpForce;
    },
    update() {
      if (globals.floor && this.collidingBottom(globals.floor)) {
        hitSound.play();

        setTimeout(() => {
          setActivePage(Pages.START)
        }, 500);
        return;
      }

      this.speed = this.speed + this.gravity;
      this.y = this.y + this.speed
    },
    movements: [
      { sX: 0, sY: 0 },
      { sX: 0, sY: 26 },
      { sX: 0, sY: 52 },
      { sX: 0, sY: 26 },
    ],
    currentFrame: 0,
    setCurrentFrame() {
      if(frames % 4 === 0) {
        this.currentFrame = (1 + this.currentFrame) % this.movements.length
      }
    },
    draw(ctx) {
      this.setCurrentFrame();
      const { sX, sY } = this.movements[this.currentFrame];
      ctx.drawImage(
        sprites,
        sX, sY,
        this.w, this.h,
        this.x, this.y,
        this.w, this.h
      );
    }
  }
}

function createPipes() {
  return {
    w: 52,
    h: 400,
    top: {
      sx: 52,
      sy: 169,
    },
    bottom: {
      sx: 0,
      sy: 169,
    },
    speed: 0,
    spacement: 200,
    draw(ctx) {

      this.pairs.forEach(pair => {
        const randomY = pair.y;
        const waySpacement = 90;

        const topX = pair.x;
        const topY = randomY;
        ctx.drawImage(
          sprites,
          this.top.sx, this.top.sy,
          this.w, this.h,
          topX, topY,
          this.w, this.h
        );

        const bottomX = pair.x;
        const bottomY = 0 + this.h + waySpacement + randomY;
        ctx.drawImage(
          sprites,
          this.bottom.sx, this.bottom.sy,
          this.w, this.h,
          bottomX, bottomY,
          this.w, this.h
        );

        pair.top = {
          x: topX,
          y: this.h + topY,
        }

        pair.bottom = {
          x: bottomX,
          y: bottomY,
        }
      });
    },
    hasCollisionWithFlappyBird(pair) {
      const birdsHead = globals.flappyBird.y;
      const birdsFeet = globals.flappyBird.y + globals.flappyBird.h - 10;

      if (globals.flappyBird.x + globals.flappyBird.w >= pair.x) {
        if (birdsHead <= pair.top.y) {
          return true;
        }

        if (birdsFeet >= pair.bottom.y) {
          return true;
        }
      }

      return false;
    },
    pairs: [],
    update() {
      if (frames % this.spacement === 0) {
        this.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        })
      }

      this.pairs.forEach(pair => {
        pair.x = pair.x - 1;

        if (this.hasCollisionWithFlappyBird(pair)) {
          setActivePage(Pages.START)
        }

        if (pair.x + this.w <= 0) {
          this.pairs.shift();
        }
      });
    }
  }
}

const getReadyMessage = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - (174/2),
  y: 50,
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
function createFloor() {
  return {
    sX: 0,
    sY: 610,
    w: 223,
    h: 112,
    x: 0,
    y: canvas.height - 112,
    update() {
      this.x = (this.x - 1) % (this.w / 2);
    },
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

const globals = {

}
let activePage = {};
function setActivePage(page) {
  activePage = page;

  if (activePage.init) {
    activePage.init();
  }
}

const Pages = {
  START: {
    init() {
      globals.flappyBird = createFlappyBird();
      globals.floor = createFloor();

      globals.pipes = createPipes();
    },
    draw(ctx) {
      background.draw(ctx);
      globals.floor.draw(ctx);
      globals.flappyBird.draw(ctx);
      getReadyMessage.draw(ctx);
    },
    click() {
      setActivePage(Pages.GAME)
    },
    update() {}
  },
  GAME: {
    draw(ctx) {
      background.draw(ctx);
      globals.pipes.draw(ctx);
      globals.floor.draw(ctx);
      globals.flappyBird.draw(ctx);
    },
    click() {
      globals.flappyBird.jump();
    },
    update(ctx) {
      globals.flappyBird.update(ctx);
      globals.pipes.update();
      globals.floor.update();
    }
  }
}

function loop() {

  activePage.draw(context)
  activePage.update(context)

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
  if (activePage?.click) {
    activePage.click();
  }
});

setActivePage(Pages.START)
loop();