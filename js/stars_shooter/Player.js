export default class Player {
  constructor(x, y, frames) {
    this.frames = frames;
    this.x = x;
    this.y = y;
    this.width = 64; // default size
    this.height = 64; // default size
    this.speed = 5;
    this.frameIndex = 0;
    this.direction = "right";
  }
  update(input, canvas) {
    if (input.right) this.x += this.speed;
    if (input.left) this.x -= this.speed;
    if (input.up) this.y -= this.speed;
    if (input.down) this.y += this.speed;

    // batasi dalam canvas
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;

    // animasi sesuai arah
    if (input.right) {
      this.frameIndex = 3; // plane4 (kanan)
      this.direction = "right";
    } else if (input.left) {
      this.frameIndex = 1; // plane2 (kiri)
      this.direction = "left";
    } else {
      this.frameIndex = this.direction === "right" ? 0 : 2; // idle plane1/plane3
    }
  }

  draw(ctx) {
    const frameImg = this.frames[this.frameIndex];
    if (frameImg.complete) {
      ctx.drawImage(frameImg, this.x, this.y, this.width, this.height);
    }
  }
}
