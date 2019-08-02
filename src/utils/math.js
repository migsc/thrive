export const isDivisibleBy = (n, d) => n % d === 0;

export const isEven = n => isDivisibleBy(n, 2);

export const isOdd = n => !isDivisibleBy(n, 2);
