export default class Explostion {
  constructor(x, y, image, frameWidth, frameHeight, frameCount, frameSpeed = 50, scale = 1) {
    (this.x = x), (this.y = y), (this.image = image), (this.frameWidth = frameWidth), (this.frameHeight = frameHeight), (this.frameCount = frameCount), (this.frameIndex = 0), (this.frameTimer = 0), (this.frameSpeed = frameSpeed);
    this.done = false;

    this.scale = scale;
    this.renderWidth = this.frameWidth * this.scale;
    this.renderHeight = this.frameHeight * this.scale;
  }

  update(deltaTime) {
    this.frameTimer += deltaTime;
    if (this.frameTimer > this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex++;
      if (this.frameIndex >= this.frameCount) {
        this.done = true;
      }
    }
  }

  draw(ctx) {
    if (!this.done) {
      ctx.drawImage(this.image, this.frameIndex * this.frameWidth, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.renderWidth, this.renderHeight);
    }
  }
}
