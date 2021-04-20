function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Bird {
  constructor(brain) {
    this.d = 30;
    this.r = this.d / 2;
    this.position = createVector(100, CANVAS_HEIGHT / 2 - this.r / 2);
    this.dead = false;
    this.velocity = createVector(0, 0);
    this.jumpAcceleration = createVector(0, 0);
    this.acceleration = createVector(0, 0.8);
    this.color = "#f05454";
    this.lift = createVector(0, -9);
    this.score = 0;
    this.fitness = 0;
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(5, 16, 2);
    }
    this.closestPipe = null;
  }
  render() {
    const { x, y } = this.position;
    fill(this.color);
    noStroke();
    ellipse(x, y, this.d, this.d);
  }
  update() {
    this.score++;
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }
  jump() {
    this.jumpAcceleration.add(createVector(0, 0));
    this.velocity.mult(0);
    this.lift.add(this.jumpAcceleration);
    this.velocity.add(this.lift);
    this.jumpAcceleration.mult(0);
  }
  detect(pipes) {
    if (pipes.length > 0) {
      let getClosest = pipes.filter(
        (pipe) => pipe.position.x > this.position.x - pipe.width
      );
      const closest = getClosest[0];
      this.closestPipe = closest;

      const { topPipe, bottomPipe } = closest;
      const topPipeCollision = {
        top: topPipe.y,
        right: topPipe.x + topPipe.width,
        bottom: topPipe.height,
        left: topPipe.x,
      };

      const bottomPipeCollision = {
        top: bottomPipe.y,
        right: bottomPipe.x + bottomPipe.width,
        bottom: bottomPipe.height,
        left: bottomPipe.x,
      };

      const gapCollision = {
        top: topPipeCollision.bottom,
        right: topPipeCollision.right,
        bottom: bottomPipeCollision.top,
        left: topPipeCollision.left,
      };

      const birdCollision = {
        top: this.position.y - this.r,
        right: this.position.x + this.r,
        bottom: this.position.y + this.r,
        left: this.position.x - this.r,
      };

      if (
        birdCollision.right >= topPipeCollision.left &&
        birdCollision.left <= topPipeCollision.right &&
        birdCollision.top <= topPipeCollision.bottom
      ) {
        this.gameOver();
      }

      if (
        birdCollision.right >= bottomPipeCollision.left &&
        birdCollision.left <= bottomPipeCollision.right &&
        birdCollision.bottom >= bottomPipeCollision.top
      ) {
        this.gameOver();
      }
      if (this.position.y + this.r <= 10) {
        this.gameOver();
      }
      if (this.position.y > height - this.r) {
        this.gameOver();
      }

      if (
        birdCollision.right >= gapCollision.left &&
        birdCollision.left <= gapCollision.right &&
        birdCollision.top <= gapCollision.bottom &&
        birdCollision.bottom >= gapCollision.top &&
        !closest.pointed
      ) {
        closest.pointed = true;
        this.addScore();
      }
    }
  }

  gameOver() {
    const deletedBird = birds.splice(birds.indexOf(this), 1);
    savedBirds.push(deletedBird[0]);
    this.dead = true;
  }

  addScore() {
    // this.score++;
    // console.log("Points: " + this.score);
  }

  think() {
    let inputs = [];
    // inputs[0] = this.position.y / height;
    // inputs[1] = this.closestPipe.topPipe.height / height;
    // inputs[2] = this.closestPipe.bottomPipe.y / height;
    // inputs[3] = this.closestPipe.position.x / width;
    // inputs[4] = this.velocity.y / 10;

    inputs[0] = map(this.position.y, 0, height, 0, 1);
    inputs[1] = map(this.closestPipe.topPipe.height, 0, height, 0, 1);
    inputs[2] = map(this.closestPipe.bottomPipe.y, 0, height, 0, 1);
    inputs[3] = map(this.closestPipe.position.x, this.position.x, width, 0, 1);
    inputs[4] = map(this.velocity.y, -5, 5, 0, 1);

    const output = this.brain.predict(inputs);
    if (output[0] > output[1]) this.jump();
  }

  copy() {
    return new Bird(this.brain);
  }
}
