class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(0));
  }

  copy() {
    let m = new Matrix(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        m.data[i][j] = this.data[i][j];
      }
    }
    return m;
  }

  randomize() {
    this.data = this.data.map((row) => row.map(() => Math.random() * 2 - 1));
  }

  static fromArray(arr) {
    let newMatrix = new Matrix(arr.length, 1);
    newMatrix.data = newMatrix.data.map((row, i) => row.map((col) => arr[i]));
    return newMatrix;
  }

  toArray() {
    let newArray = [];
    this.data.forEach((row) => row.forEach((col) => newArray.push(col)));
    return newArray;
  }

  static multiply(a, b) {
    // Matrix product
    if (a.cols !== b.rows) {
      console.log("Columns of A must match rows of B.");
      return undefined;
    }
    let result = new Matrix(a.rows, b.cols);
    for (let i = 0; i < result.rows; i++) {
      for (let j = 0; j < result.cols; j++) {
        // Dot product of values in col
        let sum = 0;
        for (let k = 0; k < a.cols; k++) {
          sum += a.data[i][k] * b.data[k][j];
        }
        result.data[i][j] = sum;
      }
    }
    return result;
  }

  multiply(number) {
    if (number instanceof Matrix) {
      this.data = this.data.map((row, i) =>
        row.map((col, j) => col * number.data[i][j])
      );
    } else {
      this.data = this.data.map((row) => row.map((col) => col * number));
    }
  }

  add(number) {
    if (number instanceof Matrix) {
      this.data = this.data.map((row, i) =>
        row.map((col, j) => col + number.data[i][j])
      );
    } else {
      this.data = this.data.map((row) => row.map((col) => col + number));
    }
  }

  static subtract(a, b) {
    const result = new Matrix(a.rows, b.rows);
    result.data = a.data.map((row, i) =>
      row.map((col, j) => col - b.data[i][j])
    );
    return result;
  }

  map(func) {
    this.data = this.data.map((row) => row.map((col) => func(col)));
  }

  static map(matrix, func) {
    let result = new Matrix(matrix.rows, matrix.cols);
    result.data = matrix.data.map((row) => row.map((col) => func(col)));
    return result;
  }

  static transpose(matrix) {
    const results = new Matrix(matrix.cols, matrix.rows);
    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        results.data[j][i] = matrix.data[i][j];
      }
    }
    return results;
  }

  print() {
    console.table(this.data);
  }
}
