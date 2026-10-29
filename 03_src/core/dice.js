/** Roll one W20 and return only its integer result (1 through 20). */
export function rollD20(random = Math.random) {
  if (typeof random !== "function") {
    throw new TypeError("random must be a function");
  }

  const sample = random();
  if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
    throw new RangeError("random must return a number in the range [0, 1)");
  }

  return Math.floor(sample * 20) + 1;
}
