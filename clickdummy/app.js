import { rollD20 } from "../03_src/core/dice.js";
import { rollAttribute } from "../03_src/core/attribute-roll.js";

const d20Result = document.querySelector("#d20-result");
const attributeResult = document.querySelector("#attribute-result");

document.querySelector("#roll-d20").addEventListener("click", () => {
  d20Result.textContent = `Der W20 zeigt ${rollD20()}.`;
});

document.querySelector("#attribute-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const fixedDie = document.querySelector("#fixed-die").value;
  const result = rollAttribute({
    attributeId: document.querySelector("#attribute-id").value,
    attributeValue: Number(document.querySelector("#attribute-value").value),
    target: Number(document.querySelector("#target").value),
    roll: fixedDie === "" ? rollD20 : () => Number(fixedDie),
  });

  attributeResult.className = `result ${result.success ? "success" : "failure"}`;
  attributeResult.replaceChildren();

  const label = document.createElement("p");
  label.className = "result-label";
  label.textContent = "ERGEBNIS";

  const details = document.createElement("div");
  details.className = "result-details";
  const values = [
    ["W20", result.dieResult],
    ["Modifikator", `${result.modifier >= 0 ? "+" : ""}${result.modifier}`],
    ["Gesamt", result.total],
    ["SG", result.target],
  ];
  for (const [name, value] of values) {
    const item = document.createElement("span");
    item.append(document.createTextNode(`${name} `));
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    item.append(strong);
    details.append(item);
  }
  const verdict = document.createElement("strong");
  verdict.className = "verdict";
  verdict.textContent = result.success ? "Erfolg" : "Misserfolg";

  attributeResult.append(label, details, verdict);
});
