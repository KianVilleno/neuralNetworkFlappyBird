function nextGeneration() {
  generations++;
  normalizeFitness(savedBirds);
  for (let i = 0; i < POPULATION; i++) {
    birds[i] = pickOne();
  }

  savedBirds = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r -= savedBirds[index].fitness;
    index++;
  }
  index -= 1;

  const birdCopy = savedBirds[index].copy();
  return birdCopy;
}

function calculateFitness() {
  let sum = 0;
  for (const bird of savedBirds) {
    sum += bird.score;
  }

  for (const bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}

// Normalize the fitness of all birds
function normalizeFitness(arrBirds) {
  // Make score exponentially better?
  for (let i = 0; i < birds.length; i++) {
    arrBirds[i].score = pow(arrBirds[i].score, 2);
  }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < arrBirds.length; i++) {
    sum += arrBirds[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < arrBirds.length; i++) {
    arrBirds[i].fitness = arrBirds[i].score / sum;
  }
}

const getBestBird = () =>
  birds.reduce((acc, curr) => (acc.score > curr.score ? acc : curr));
