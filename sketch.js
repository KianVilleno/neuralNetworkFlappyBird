const POPULATION = 500;
let CANVAS_WIDTH = 500;
let CANVAS_HEIGHT = 400;

let generations = 0;

let counter = 0;

let birds = [];
let savedBirds = [];
let pipes = [];

let slider;
let generationText;
let showOnlyBestBird = false;

let bestBird = null;

let visualBestBird = null;

let show_nn_btn;
let show_bb_btn;

let speed_up_label;

let show_nn_ = false;

let visual;

let button_div;
let slider_div;
let nn;

function setup() {
  if (CANVAS_WIDTH >= window.innerWidth) {
    CANVAS_WIDTH = window.innerWidth;
  }

  generationText = createP("");
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  slider_div = createDiv("");
  slider_div.attribute("class", "slider-div");
  slider = createSlider(1, 100, 1);
  slider.parent(slider_div);
  speed_up_label = createP(`speed: 1x`);
  speed_up_label.parent(slider_div);
  speed_up_label.attribute("class", "speed-up-label");

  slider.attribute("class", "speed-up-slider");

  bird = new Bird();
  for (let i = 0; i < POPULATION; i++) {
    birds.push(new Bird());
  }

  nn = new NeuralNetwork(5, 16, 2);
  visual = new VisualNeuralNetwork(nn);

  button_div = createDiv("");
  button_div.attribute("class", "button-div");

  show_nn_btn = createButton("Show Neural Network Visual");
  show_nn_btn.parent(button_div);
  show_bb_btn = createButton("Show the best bird only");
  show_bb_btn.parent(button_div);
  show_bb_btn.mouseClicked(() => {
    showBestBird();
    const hide_show = showOnlyBestBird
      ? "Show all birds"
      : "Show the best bird only";
    show_bb_btn.html(hide_show);
  });
  show_nn_btn.mouseClicked(() => {
    show_nn_ = !show_nn_;
    const hide_show = show_nn_ ? "Hide" : "Show";
    show_nn_btn.html(`${hide_show} Neural Network Visual`);
  });
}

function draw() {
  background("#bbbfca");
  generationText.elt.innerText = "Generations: " + generations;
  for (let n = 0; n < slider.value(); n++) {
    logic();
  }
  renders();

  if (show_nn_) visual.render();
  speed_up_label.html(`speed: ${slider.value()}x`);
}

function logic() {
  getVisualBestBird();
  generatePipe();
  bestBird = getBestBird();
  visual.update(bestBird.brain);

  for (const bird of birds) {
    bird.detect(pipes);
    bird.think();
    bird.update();
  }

  if (birds.length === 0) {
    counter = 0;
    pipes = [];
    nextGeneration();
  }

  removePipes();
  for (const pipe of pipes) {
    pipe.update();
  }
}

function renders() {
  // Render

  background("#214252");
  for (const pipe of pipes) {
    pipe.render();
  }
  if (showOnlyBestBird) {
    visualBestBird.render();
  } else {
    for (const bird of birds) {
      bird.render();
    }
  }
}

function generatePipe() {
  if (counter % 75 === 0) pipes.push(new Pipe());
  counter++;
}

function removePipes() {
  for (const pipe of pipes) {
    if (pipe.remove) pipes.splice(pipes.indexOf(pipe), 1);
  }
}

let prevGeneration = null;

function getVisualBestBird() {
  if (prevGeneration !== generations || visualBestBird.dead) {
    prevGeneration = generations;
    visualBestBird = birds.filter((x) => !x.dead);
    visualBestBird = birds.reduce((acc, curr) =>
      acc.score > curr.score ? acc : curr
    );
  }
}

function showBestBird() {
  showOnlyBestBird = !showOnlyBestBird;
}
