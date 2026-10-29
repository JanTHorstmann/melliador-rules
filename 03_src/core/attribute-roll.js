import { rollD20 } from "./dice.js";

export const ATTRIBUTE_IDS = Object.freeze(["str", "dex", "con", "int", "wis", "cha"]);

/**
 * Return the modifier from the Schnellstarter table, extended to score 20
 * with the project owner's specified +5 value.
 */
export function getAttributeModifier(attributeValue) {
  if (!Number.isInteger(attributeValue) || attributeValue < 4 || attributeValue > 20) {
    throw new RangeError("attributeValue must be an integer from 4 through 20");
  }

  return Math.floor((attributeValue - 10) / 2);
}

/** Roll an attribute check using an explicit score and the supplied target. */
export function rollAttribute({ attributeId, attributeValue, target, roll = rollD20 } = {}) {
  if (!ATTRIBUTE_IDS.includes(attributeId)) {
    throw new RangeError(`Unknown attributeId: ${String(attributeId)}`);
  }
  if (typeof target !== "number" || !Number.isFinite(target)) {
    throw new TypeError("target must be a finite number");
  }
  if (typeof roll !== "function") {
    throw new TypeError("roll must be a function");
  }

  const modifier = getAttributeModifier(attributeValue);
  const dieResult = roll();
  if (!Number.isInteger(dieResult) || dieResult < 1 || dieResult > 20) {
    throw new RangeError("roll must return an integer from 1 through 20");
  }

  const total = dieResult + modifier;
  return Object.freeze({
    type: "attribute",
    attributeId,
    dieResult,
    modifier,
    target,
    total,
    success: total >= target,
  });
}
