// diagonal-difference/index.js
function diagonalDifference(mat) {
  const n = mat.length;
  let diagonalA = 0;
  let diagonalB = 0;

  for (let i = 0; i < n; i++) {
    diagonalA += mat[i][i];
    diagonalB += mat[i][n - 1 - i];
  }

  return Math.abs(diagonalA - diagonalB);
}

const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(diagonalDifference(matrix));
