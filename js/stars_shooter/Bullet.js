export default class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.speed = 7;
  }
  update() {
    this.y -= this.speed;
  }

  draw(ctx) {
    ctx.save();

    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, "#9fffffff");
    gradient.addColorStop(1, "#3b82f6");

    ctx.fillStyle = gradient;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 25;

    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.restore();
  }
}
