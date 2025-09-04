import Bullet from "./Bullet.js";

export default class EnemyBullet extends Bullet {
  constructor(x, y) {
    super(x, y);
    this.speed = 5;
  }
  update() {
    this.y += this.speed;
  }
  draw(ctx) {
    ctx.fillStyle = "#f63b3bff";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
