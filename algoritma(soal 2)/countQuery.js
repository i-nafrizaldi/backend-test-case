function countOccurrences(input, query) {
  const count = query.map((word) => {
    return input.filter((item) => item === word).length;
  });

  return count;
}

const input = ["xc", "dz", "bbb", "dz"];
const query = ["bbb", "ac", "dz"];
console.log(countOccurrences(input, query));
