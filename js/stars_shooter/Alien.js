import Enemy from "./Enemy.js";
import EnemyBullet from "./EnemyBullet.js";

export default class Alien extends Enemy {
  constructor(x, y, img, canvasWidth) {
    super(x, y, 64, 64, 1, img);
    this.moveSpeed = 2;
    this.shootInterval = 300; // tiap 100 frame
    this.canvasWidth = canvasWidth;
  }

  update(deltaTime) {
    this.x += this.moveSpeed * this.horizontal;
    if (this.x <= 0 || this.x + this.width >= this.canvasWidth) {
      this.horizontal *= -1; //putar arah
    }

    this.y += this.speed * 0.2; //biar selow kalo turun

    if (this.shootCoolDown <= 0) {
      this.shoot();
      this.shootCoolDown = this.shootInterval;
    } else {
      this.shootCoolDown--;
    }

    this.bullets.forEach((b) => b.update(deltaTime));
    this.bullets = this.bullets.filter((b) => b.y < 600);
  }
  draw(ctx) {
    super.draw(ctx);
    this.bullets.forEach((b) => b.draw(ctx));
  }

  shoot() {
    this.bullets.push(new EnemyBullet(this.x + this.width / 2, this.y + this.height));
  }
}
