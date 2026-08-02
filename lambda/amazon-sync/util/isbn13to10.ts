export function isbn13To10(isbn: string) {
  if (isbn?.length === 10) {
    return isbn;
  }
  if (isbn == null || isbn.length !== 13 || !isbn.startsWith("978")) {
    return null;
  }

  isbn = isbn.slice(3);
  isbn = isbn.slice(0, isbn.length - 1);

  let multiplyBy = 1;
  let sum = 0;
  for (const char of [...isbn]) {
    if (isNaN(parseInt(char))) {
      return null;
    }

    sum += parseInt(char, 10) * multiplyBy;
    multiplyBy++;
  }
  const checkDigit = sum % 11;

  return [...isbn, checkDigit == 10 ? "X" : checkDigit].join("");
}
