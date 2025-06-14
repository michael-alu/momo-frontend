function shortNumber(num) {
  if (typeof num !== "number") {
    throw new TypeError("Expected a number");
  }

  if (num > 1e19) {
    throw new RangeError("Input expected to be < 1e19");
  }

  if (num < -1e19) {
    throw new RangeError("Input expected to be > -1e19");
  }

  if (Math.abs(num) < 1000) {
    return `${toFixed(num)}`;
  }

  let shortNum;
  let exponent;
  let size;
  const sign = num < 0 ? "-" : "";

  const suffixes = {
    K: 6,
    M: 9,
    B: 12,
    T: 16,
  };

  num = Math.abs(num);
  size = Math.floor(num).toString().length;

  exponent = size % 3 === 0 ? size - 3 : size - (size % 3);
  shortNum = `${toFixed(toFixed(10 * (num / Math.pow(10, exponent))) / 10)}`;

  for (const [suffix, limit] of Object.entries(suffixes)) {
    if (exponent < limit) {
      shortNum = `${shortNum}${suffix}`;
      break;
    }
  }

  return `${sign}${shortNum}`;
}

const toFixed = input => {
  if (isNaN(input)) {
    throw new Error("Number cannot be converted");
  }

  if (typeof input === "string") {
    input = Number(input);
  }

  return Number(input.toFixed(2));
};

const toCurrency = (amount, shouldShorten = false) => {
  const result = new Intl.NumberFormat("en-GB", {
    currency: "RWF",
    style: "currency",
  }).format(amount);

  if (shouldShorten) {
    return `${result.charAt(0)}${shortNumber(amount)}`;
  }

  return result;
};
