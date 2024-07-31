// NO.1 --- Reverse Alphabet
function reverseAlphabet(input) {
  const letters = input.match(/[A-Z]/g).reverse().join("");
  const numbers = input.match(/\d/g).join("");

  return letters + numbers;
}

const input = "NEGIE1";
console.log(reverseAlphabet(input));

