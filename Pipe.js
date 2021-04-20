class Pipe {
  constructor() {
    this.gap = 130;
    this.minHeight = 50;
    this.topPipeHeight = random(
      this.minHeight,
      height - (this.gap + this.minHeight)
    );
    this.bottomPipeHeight = height - (this.topPipeHeight + this.gap);
    this.width = 95;
    this.position = createVector(width + this.width, 0);
    // this.position = createVector(300, 0);
    this.speed = createVector(-4, 0);
    this.remove = false;
    this.pointed = false;

    this.color = "#8db596";

    this.topPipe = {
      x: this.position.x,
      y: 0,
      width: this.width,
      height: this.topPipeHeight,
    };

    this.bottomPipe = {
      x: this.position.x,
      y: this.topPipeHeight + this.gap,
      width: this.width,
      height: this.bottomPipeHeight,
    };
  }
  render() {
    const { color, topPipe, bottomPipe, position } = this;

    fill(color);
    noStroke();
    // Top Pipe
    rect(position.x, topPipe.y, topPipe.width, topPipe.height);
    // Top Bottom
    rect(position.x, bottomPipe.y, bottomPipe.width, bottomPipe.height);
  }
  update() {
    if (this.position.x < -this.width) {
      this.remove = true;
    } else {
      this.position.add(this.speed);
      this.topPipe.x = this.position.x;
      this.bottomPipe.x = this.position.x;
    }
  }
}
