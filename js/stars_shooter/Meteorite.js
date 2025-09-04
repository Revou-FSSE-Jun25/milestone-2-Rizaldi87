import Enemy from "./Enemy.js";

export default class Meteorite extends Enemy {
  constructor(x, y, frames, frameDelay = 500) {
    super(x, y, frames[0].width, frames[0].height, 2);
    this.frames = frames; // array gambar [img1, img2, img3]
    this.frameIndex = 0;
    this.frameDelay = frameDelay;
    this.frameTimer = 0;
  }

  update(deltaTime) {
    super.update();

    // update animasi meteor
    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameDelay) {
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      this.frameTimer = 0;
    }
  }

  draw(ctx) {
    const frameImg = this.frames[this.frameIndex];
    if (frameImg.complete) {
      ctx.drawImage(frameImg, this.x, this.y, this.width, this.height);
    }
  }
}
