class VisualNeuralNetwork {
  constructor(neuralNetwork) {
    this.neuralNetwork = neuralNetwork;
    this.output = neuralNetwork.outputs;
    this.inputNodes = {
      name: "inputNodes",
      value: neuralNetwork.inputNodes,
      offsetY: 20,
    };
    this.hiddenNodes = {
      name: "hiddenNodes",
      value: neuralNetwork.hiddenNodes,
      offsetY: 5,
    };
    this.outputNodes = {
      name: "outputNodes",
      value: neuralNetwork.outputNodes,
      offsetY: 60,
    };

    this.inputToHidden = neuralNetwork.weights_InputHidden;
    this.hiddentToOutput = neuralNetwork.weights_HiddenOutput;
    this.inputs = neuralNetwork.inputs;

    this.diameter = 10;
    this.radius = this.diameter / 2;

    this.x = 0;
    this.y = 0;

    this.inputOffset = 40;
    this.hiddenOffset = 4;
    this.outputOffset = 100;
    this.Xoffset = this.diameter * 8;

    this.inputNodesVisual = this.generateNodes(
      this.inputNodes,
      this.hiddenNodes
    );
    this.hiddenNodesVisual = this.generateNodes(
      this.hiddenNodes,
      this.inputNodes
    );
    this.outputNodesVisual = this.generateNodes(
      this.outputNodes,
      this.hiddenNodes
    );
  }

  render() {
    if (this.output && this.inputs) {
      this.connect();
    }
    for (const input of this.inputNodesVisual) {
      input.render();
    }
    for (const hidden of this.hiddenNodesVisual) {
      hidden.render();
    }
    for (const output of this.outputNodesVisual) {
      output.render();
    }

    // for (let i = 0; i < this.inputNodesData.length; i++) {
    //   for (let j = 0; j < this.hiddenNodesData.length; j++) {
    //     const a = this.inputNodesData[i];
    //     const b = this.hiddenNodesData[j];
    //     a.connect(b);
    //   }
    // }

    // for (let i = 0; i < this.outputNodesData.length; i++) {
    //   for (let j = 0; j < this.hiddenNodesData.length; j++) {
    //     const a = this.outputNodesData[i];
    //     const b = this.hiddenNodesData[j];
    //     a.connect(b);
    //   }
    // }
  }

  connect(rate = 0.5) {
    for (let i = 0; i < this.inputNodes.value; i++) {
      for (let j = 0; j < this.hiddenNodes.value; j++) {
        const a = this.inputNodesVisual[i];
        const b = this.hiddenNodesVisual[j];

        if (
          this.inputs.data[i] > rate &&
          this.inputToHidden.data[j][i] > rate
        ) {
          a.connect(b, this.inputToHidden.data[j][i] * 3);
        }
      }
    }

    let highest = this.output.reduce((acc, curr) => (acc > curr ? acc : curr));

    for (let i = 0; i < this.outputNodes.value; i++) {
      for (let j = 0; j < this.hiddenNodes.value; j++) {
        const a = this.outputNodesVisual[i];
        const b = this.hiddenNodesVisual[j];

        if (
          this.output[i] === highest &&
          this.hiddentToOutput.data[i][j] > highest
        ) {
          a.connect(b, this.hiddentToOutput.data[i][j] * 3);
        }
      }
    }
  }

  generateNodes(type, other) {
    let arr = [];
    let x = 0;

    switch (type.name) {
      case "inputNodes":
        x = 0;
        break;
      case "hiddenNodes":
        x = this.Xoffset;
        break;
      case "outputNodes":
        x = this.Xoffset * 2;
        break;
    }

    const center = this.getCenter(type, other);

    for (let i = 0; i < type.value; i++) {
      const y = (this.diameter + type.offsetY) * i;
      arr.push(
        new Node(
          this.x + this.diameter + x,
          this.y + this.diameter + y + center,
          this.diameter
        )
      );
    }
    return arr;
  }

  calculateHeight(obj) {
    let sum = 0;
    for (let i = 0; i < obj.value; i++) {
      sum += this.diameter;
      if (i != 0 && i != obj.value - 1) sum += obj.offsetY;
    }
    if (obj.value == 2) sum += obj.offsetY;
    return sum;
  }

  getCenter(a, b) {
    a = this.calculateHeight(a);
    b = this.calculateHeight(b);
    return a < b ? (b - a) / 2 : 0;
  }
  update(nn) {
    this.inputToHidden = nn.weights_InputHidden;
    this.hiddentToOutput = nn.weights_HiddenOutput;
    this.inputs = nn.inputs;
    this.output = nn.outputs;
  }
}

class Node {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.radius = diameter / 2;
    this.color = "#1a1c20";
  }

  render() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.diameter);
  }

  connect(node, weight = 1, color = "#f9813a") {
    stroke(color);
    strokeWeight(weight);
    line(this.x, this.y, node.x, node.y);
  }
}
