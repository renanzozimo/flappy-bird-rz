console.log('Flappy Bird - Renan Zózimo');
console.log('https://www.renanzozimo.github.io');

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
      if (this.collidingBottom(floor)) {
        hitSound.play();

        setTimeout(() => {
          setActivePage(Pages.START)
        }, 500);
        return;
      }

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

    },
    draw(ctx) {
      background.draw(ctx);
      globals.floor.draw(ctx);
      getReadyMessage.draw(ctx);
      globals.flappyBird.draw(ctx);
    },
    click() {
      setActivePage(Pages.GAME)
    },
    update() {
      globals.floor.update();
    }
  },
  GAME: {
    draw(ctx) {
      background.draw(ctx);
      globals.floor.draw(ctx);
      globals.flappyBird.draw(ctx);
    },
    click() {
      globals.flappyBird.jump();
    },
    update(ctx) {
      globals.flappyBird.update(ctx);
    }
  }
}

function loop() {

  activePage.draw(context)
  activePage.update(context)

  requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
  if (activePage?.click) {
    activePage.click();
  }
});

setActivePage(Pages.START)
loop();