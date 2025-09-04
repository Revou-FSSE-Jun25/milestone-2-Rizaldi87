export default class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = 7;
  }
  update() {
    this.y -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
