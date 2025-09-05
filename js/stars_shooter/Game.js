import { GameState } from "./GameState.js";
import Player from "./Player.js";
import Bullet from "./Bullet.js";
import Enemy from "./Enemy.js";
import Stars from "./Stars.js";
import Explosion from "./Explosion.js";
import Meteorite from "./Meteorite.js";
import Alien from "./Alien.js";

export default class Game {
  constructor(canvas, ctx, playerFrames) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.input = { left: false, right: false, up: false, down: false, shoot: false };
    this.player = new Player(canvas.width / 2, canvas.height - 80, playerFrames);
    this.bullets = [];
    this.enemies = [];
    this.stars = [];
    this.lastEnemySpawn = 0;
    this.shootCooldown = 0;

    this.state = GameState.RUNNING;

    this.score = 0;
    const scoreElement = document.getElementById("score");
    this.scoreElement = scoreElement;

    this.explosions = [];
    const explosionImg = new Image();
    explosionImg.src = "img/explosion.png";
    this.explosionImg = explosionImg;

    //meteor
    this.meteorframes = [];
    for (let i = 1; i <= 3; i++) {
      const img = new Image();
      img.src = `img/meteorite/Meteor${i}.png`; // pastikan path benar
      this.meteorframes.push(img);
    }

    //alien
    this.alienImg = new Image();
    this.alienImg.src = "img/alien/alien.png";

    for (let i = 0; i < 100; i++) {
      this.stars.push(new Stars(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 0.5, 2));
    }

    window.addEventListener("keydown", (e) => this.handleInput(e, true));
    window.addEventListener("keyup", (e) => this.handleInput(e, false));

    const joystick = document.getElementById("joystick");
    const stick = document.getElementById("stick");
    const shootBtn = document.getElementById("shootBtn");

    this.touchInput = { left: false, right: false, up: false, down: false, shoot: false };

    let active = false;
    let startX = 0;
    let startY = 0;

    joystick.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      active = true;
      startX = touch.clientX;
      startY = touch.clientY;
    });

    joystick.addEventListener(
      "touchmove",
      (e) => {
        if (!active) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        // update posisi stick visual
        const maxDist = 40; // radius
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDist);
        const angle = Math.atan2(dy, dx);
        stick.style.transform = `translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px) translate(-50%, -50%)`;

        // arah movement
        this.touchInput.left = dx < -10;
        this.touchInput.right = dx > 10;
        this.touchInput.up = dy < -10;
        this.touchInput.down = dy > 10;

        e.preventDefault();
      },
      { passive: false }
    );

    joystick.addEventListener("touchend", () => {
      active = false;
      stick.style.transform = "translate(-50%, -50%)";
      this.touchInput.left = false;
      this.touchInput.right = false;
      this.touchInput.up = false;
      this.touchInput.down = false;
    });

    // tombol shoot
    shootBtn.addEventListener("touchstart", () => {
      this.touchInput.shoot = true;
    });
    shootBtn.addEventListener("touchend", () => {
      this.touchInput.shoot = false;
    });

    this.combinedInput = { left: false, right: false, up: false, down: false, shoot: false };
  }

  handleInput(e, isDown) {
    // update input keyboard
    if (e.code === "ArrowLeft") this.input.left = isDown;
    if (e.code === "ArrowRight") this.input.right = isDown;
    if (e.code === "ArrowUp") this.input.up = isDown;
    if (e.code === "ArrowDown") this.input.down = isDown;
    if (e.code === "Space") this.input.shoot = isDown;

    // gabungkan dengan touch input
    this.combinedInput = {
      left: this.input.left || this.touchInput?.left || false,
      right: this.input.right || this.touchInput?.right || false,
      up: this.input.up || this.touchInput?.up || false,
      down: this.input.down || this.touchInput?.down || false,
      shoot: this.input.shoot || this.touchInput?.shoot || false,
    };
  }
  updateCombinedInput() {
    this.combinedInput.left = this.input.left || this.touchInput.left;
    this.combinedInput.right = this.input.right || this.touchInput.right;
    this.combinedInput.up = this.input.up || this.touchInput.up;
    this.combinedInput.down = this.input.down || this.touchInput.down;
    this.combinedInput.shoot = this.input.shoot || this.touchInput.shoot;
  }

  update(deltaTime) {
    switch (this.state) {
      case GameState.RUNNING:
        this.score += deltaTime * 0.005;
        this.scoreElement.textContent = Math.floor(this.score);

        this.checkCollision();
        this.stars.forEach((s) => s.update(this.canvas));
        this.updateCombinedInput();
        this.player.update(this.combinedInput, this.canvas);

        if (this.combinedInput.shoot && this.shootCooldown <= 0) {
          this.bullets.push(new Bullet(this.player.x + this.player.width / 2 - 2, this.player.y));
          this.shootCooldown = 500; // cooldown dalam ms (200 ms = 5 peluru/detik)
        }

        if (this.shootCooldown > 0) {
          this.shootCooldown -= deltaTime;
        }

        this.bullets.forEach((b) => b.update());

        this.lastEnemySpawn += deltaTime;
        if (this.lastEnemySpawn > 1000) {
          const randomXPos = Math.random() * (this.canvas.width - 50);

          if (Math.random() < 0.7) {
            this.enemies.push(new Meteorite(randomXPos, -30, this.meteorframes));
          } else {
            this.enemies.push(new Alien(randomXPos, -30, this.alienImg, this.canvas.width));
          }
          this.lastEnemySpawn = 0;
        }
        this.enemies.forEach((e) => e.update(deltaTime));
        break;
      case GameState.GAME_OVER:
        document.getElementById("restartBtn").classList.remove("hidden");
        break;
      default:
        break;
    }
    this.explosions.forEach((ex, i) => {
      ex.update(deltaTime);
      if (ex.done) this.explosions.splice(i, 1);
    });
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.stars.forEach((s) => s.draw(this.ctx));
    if (this.state === GameState.RUNNING) {
      this.player.draw(this.ctx);
    }

    this.bullets.forEach((b) => b.draw(this.ctx));
    this.enemies.forEach((e) => e.draw(this.ctx));

    this.explosions.forEach((ex) => ex.draw(this.ctx));
  }

  checkCollision() {
    this.bullets.forEach((bullet, bulletIndex) => {
      this.enemies.forEach((enemy, enemyIndex) => {
        if (bullet.x < enemy.x + enemy.width && bullet.x + bullet.width > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + bullet.height > enemy.y) {
          this.explosions.push(new Explosion(enemy.x, enemy.y, this.explosionImg, 32, 32, 6, 80, 2));
          this.bullets.splice(bulletIndex, 1);
          this.enemies.splice(enemyIndex, 1);
          if (enemy instanceof Meteorite) this.score += 20;
          else if (enemy instanceof Alien) this.score += 30;
        }
      });
    });

    this.enemies.forEach((enemy) => {
      const padding = 30; // karena pesawat kayak segi3
      // jadi ini agar lebar collisionnya lebih kecil
      //tapi susah sekali biar akurat karena bentuknya tetap KOTAK

      if (this.player.x < enemy.x + enemy.width / 2 && this.player.x + this.player.width - padding > enemy.x && this.player.y < enemy.y + enemy.height / 2 && this.player.y + this.player.height > enemy.y) {
        this.explosions.push(new Explosion(this.player.x, this.player.y, this.explosionImg, 32, 32, 6, 80, 2));
        this.state = GameState.GAME_OVER;
      }

      if (enemy instanceof Alien) {
        enemy.bullets.forEach((bullet) => {
          if (bullet.x < this.player.x + this.player.width && bullet.x + bullet.width > this.player.x && bullet.y < this.player.y + this.player.height && bullet.y + bullet.height > this.player.y) {
            this.explosions.push(new Explosion(this.player.x, this.player.y, this.explosionImg, 32, 32, 6, 80, 2));
            this.state = GameState.GAME_OVER;
          }
        });
      }
    });
  }
  restart() {
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 80, this.player.frames);
    this.bullets = [];
    this.enemies = [];
    this.stars = [];
    this.lastEnemySpawn = 0;
    this.shootCooldown = 0;

    // regenerate stars
    for (let i = 0; i < 100; i++) {
      this.stars.push(new Stars(Math.random() * this.canvas.width, Math.random() * this.canvas.height, Math.random() * 2 + 0.5, 2));
    }

    this.state = GameState.RUNNING;
  }
}
