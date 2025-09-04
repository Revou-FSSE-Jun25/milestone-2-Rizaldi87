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

    this.explosions = [];
    const explosionImg = new Image();
    explosionImg.src = "img/explosion.png";
    this.explosionImg = explosionImg;

    //meteor
    this.meteorframes = [];
    for (let i = 1; i <= 3; i++) {
      const img = new Image();
      img.src = `img/meteorite/meteor${i}.png`; // pastikan path benar
      this.meteorframes.push(img);
    }

    for (let i = 0; i < 100; i++) {
      this.stars.push(new Stars(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 0.5, 2));
    }

    window.addEventListener("keydown", (e) => this.handleInput(e, true));
    window.addEventListener("keyup", (e) => this.handleInput(e, false));
  }

  handleInput(e, isDown) {
    if (e.code === "ArrowLeft") this.input.left = isDown;
    if (e.code === "ArrowRight") this.input.right = isDown;
    if (e.code === "ArrowUp") this.input.up = isDown;
    if (e.code === "ArrowDown") this.input.down = isDown;
    if (e.code === "Space") this.input.shoot = isDown;
  }

  update(deltaTime) {
    switch (this.state) {
      case GameState.RUNNING:
        this.checkCollision();
        this.stars.forEach((s) => s.update(this.canvas));

        this.player.update(this.input, this.canvas);

        if (this.input.shoot && this.shootCooldown <= 0) {
          this.bullets.push(new Bullet(this.player.x + this.player.width / 2 - 2, this.player.y));
          this.shootCooldown = 200; // cooldown dalam ms (200 ms = 5 peluru/detik)
        }

        if (this.shootCooldown > 0) {
          this.shootCooldown -= deltaTime;
        }

        this.bullets.forEach((b) => b.update());

        this.lastEnemySpawn += deltaTime;
        if (this.lastEnemySpawn > 1000) {
          this.enemies.push(new Meteorite(Math.random() * (this.canvas.width - 50), -30, this.meteorframes));
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
        }
      });
    });

    this.enemies.forEach((enemy) => {
      const padding = 30; // karena pesawat kayak segi3
      // jadi ini agar lebar collisionnya lebih kecil
      //tapi susah sekali biar akurat karena bentuknya tetap KOTAK

      if (this.player.x < enemy.x + enemy.width && this.player.x + this.player.width - padding > enemy.x && this.player.y < enemy.y + enemy.height && this.player.y + this.player.height > enemy.y) {
        this.explosions.push(new Explosion(this.player.x, this.player.y, this.explosionImg, 32, 32, 6, 80, 2));
        this.state = GameState.GAME_OVER;
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
