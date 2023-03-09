export function isbn13To10(isbn: string) {
  if (!isbn.startsWith("978")) {
    return null;
  }

  isbn = isbn.slice(3);
  isbn = isbn.slice(0, isbn.length - 1);

  let multiplyBy = 10;
  let sum = 0;
  for (const char of [...isbn]) {
    // @ts-ignore
    if (isNaN(char)) {
      return null;
    }

    sum += parseInt(char, 10) * multiplyBy;
    multiplyBy--;
  }
  const checkDigit = 11 - (sum % 11);

  return [...isbn, checkDigit].join("");
}
