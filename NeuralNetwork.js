const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const dSigmoid = (y) => y * (1 - y);

class NeuralNetwork {
  constructor(numberOfInput, numberOfHidden, numberOfOutput) {
    if (numberOfInput instanceof NeuralNetwork) {
      const NN = numberOfInput;
      this.inputNodes = NN.inputNodes;
      this.hiddenNodes = NN.hiddenNodes;
      this.outputNodes = NN.outputNodes;
      this.inputs = NN.inputs;
      this.outputs = NN.outputs;

      this.weights_InputHidden = NN.weights_InputHidden.copy();
      this.weights_HiddenOutput = NN.weights_HiddenOutput.copy();

      this.bias_Hidden = NN.bias_Hidden.copy();
      this.bias_Output = NN.bias_Output.copy();

      this.learningRate = 0.1;
    } else {
      this.inputNodes = numberOfInput;
      this.hiddenNodes = numberOfHidden;
      this.outputNodes = numberOfOutput;

      this.inputs = null;
      this.outputs = null;

      this.weights_InputHidden = new Matrix(this.hiddenNodes, this.inputNodes);
      this.weights_HiddenOutput = new Matrix(
        this.outputNodes,
        this.hiddenNodes
      );

      this.weights_InputHidden.randomize();
      this.weights_HiddenOutput.randomize();

      this.bias_Hidden = new Matrix(this.hiddenNodes, 1);
      this.bias_Output = new Matrix(this.outputNodes, 1);
      this.bias_Hidden.randomize();
      this.bias_Output.randomize();

      this.learningRate = 0.1;
    }
  }

  mutate(func) {
    this.weights_InputHidden.map(func);
    this.weights_HiddenOutput.map(func);
    this.bias_Output.map(func);
    this.bias_Hidden.map(func);
  }

  setLearningRate(number) {
    this.learningRate = number;
  }

  predict(input) {
    // Generating the Hidden
    input = Matrix.fromArray(input);
    this.inputs = input;
    let hidden = Matrix.multiply(this.weights_InputHidden, input);
    hidden.add(this.bias_Hidden);
    // activation function
    hidden.map(sigmoid);

    let output = Matrix.multiply(this.weights_HiddenOutput, hidden);
    output.add(this.bias_Output);

    // activation function
    output.map(sigmoid);

    this.outputs = output.toArray();
    return output.toArray();
  }
  train(input, target) {
    // Generating the Hidden
    input = Matrix.fromArray(input);
    let hidden = Matrix.multiply(this.weights_InputHidden, input);
    hidden.add(this.bias_Hidden);
    // activation function
    hidden.map(sigmoid);

    let outputs = Matrix.multiply(this.weights_HiddenOutput, hidden);
    outputs.add(this.bias_Output);

    // activation function
    outputs.map(sigmoid);

    target = Matrix.fromArray(target);

    // Calculate Gradients
    const output_Errors = Matrix.subtract(target, outputs);
    const gradients = Matrix.map(outputs, dSigmoid);
    gradients.multiply(output_Errors);
    gradients.multiply(this.learningRate);

    // Calculate deltas
    const transposedHidden = Matrix.transpose(hidden);
    const deltaWeightsHiddenOutput = Matrix.multiply(
      gradients,
      transposedHidden
    );

    // Adjust the weight by deltas
    this.weights_HiddenOutput.add(deltaWeightsHiddenOutput);
    // Adjust the Bias
    this.bias_Output.add(gradients);

    // Calculate the Hidden layer error
    const transposed_WeightsHiddenOutput = Matrix.transpose(
      this.weights_HiddenOutput
    );
    const hidden_Errors = Matrix.multiply(
      transposed_WeightsHiddenOutput,
      output_Errors
    );

    // Calculate the gradient of hidden layer
    const gradients_Hidden = Matrix.map(hidden, dSigmoid);
    gradients_Hidden.multiply(hidden_Errors);
    gradients_Hidden.multiply(this.learningRate);

    // Calculate the delta weight of IH
    const transposedInput = Matrix.transpose(input);
    const deltaWeightsInputHidden = Matrix.multiply(
      gradients_Hidden,
      transposedInput
    );

    // Adjust the weight by deltas
    this.weights_InputHidden.add(deltaWeightsInputHidden);
    this.bias_Hidden.add(gradients_Hidden);
  }
  copy() {
    return new NeuralNetwork(this);
  }
}
