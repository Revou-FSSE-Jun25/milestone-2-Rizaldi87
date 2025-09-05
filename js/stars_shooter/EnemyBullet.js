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
    ctx.save();

    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, "#ffdd95ff");
    gradient.addColorStop(1, "#f63b3bff");

    ctx.fillStyle = gradient;
    ctx.shadowColor = "rgba(255, 102, 0, 1)ff";
    ctx.shadowBlur = 25;

    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
