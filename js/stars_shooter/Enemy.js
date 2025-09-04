export default class Enemy {
  constructor(x, y, width, height, speed, img) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.img = img;
    //properti khusus alien
    this.horizontal = 1; //InsyaAllah kanan kalo direstui
    this.bullets = [];
    this.shootCoolDown = 0;
  }
  update(deltaTime) {
    this.y += this.speed;
  }
  draw(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }
}
