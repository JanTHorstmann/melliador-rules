const FLAG_SCOPE = "melliador-rules";
const FLAG_KEY = "testCharacter";

const ABILITIES = Object.freeze([
  { id: "str", label: "Stärke", score: 18 },
  { id: "dex", label: "Geschicklichkeit", score: 14 },
  { id: "con", label: "Konstitution", score: 16 },
  { id: "int", label: "Intelligenz", score: 10 },
  { id: "wis", label: "Weisheit", score: 12 },
  { id: "cha", label: "Charisma", score: 8 },
]);

function modifierFor(score) {
  return Math.floor((score - 10) / 2);
}

function formatModifier(modifier) {
  return modifier >= 0 ? `+${modifier}` : String(modifier);
}

export function registerTestCharacterSheet({ rollD20, rollAttribute, postRollToChat }) {
  const { ActorSheetV2 } = foundry.applications.sheets;
  const { HandlebarsApplicationMixin } = foundry.applications.api;

  class MelliadorTestCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    static DEFAULT_OPTIONS = {
      classes: ["melliador-rules", "test-character-sheet"],
      position: { width: 1040, height: 790 },
      window: { title: "Melliador Rules – Testcharakterbogen" },
      actions: {
        "roll-d20": this.#onRollD20,
        "roll-attribute": this.#onRollAttribute,
        "save-test-data": this.#onSaveTestData,
      },
    };

    static PARTS = {
      main: { template: "systems/melliador-rules/templates/test-character-sheet.hbs" },
    };

    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      const saved = this.document.getFlag(FLAG_SCOPE, FLAG_KEY) ?? {};
      const savedAbilities = saved.abilities ?? {};

      return {
        ...context,
        characterName: this.document.name,
        abilities: ABILITIES.map((ability) => {
          const score = savedAbilities[ability.id] ?? ability.score;
          return { ...ability, score, modifier: formatModifier(modifierFor(score)) };
        }),
        target: saved.target ?? 15,
        lastResult: saved.lastResult ?? "Noch kein Wurf ausgeführt.",
      };
    }

    _onRender(context, options) {
      super._onRender(context, options);
      this.element.addEventListener("input", (event) => {
        const input = event.target.closest("[data-attribute-value]");
        if (!input) return;
        const output = this.element.querySelector(`[data-modifier-for="${input.dataset.attributeValue}"]`);
        const score = Number(input.value);
        if (output) output.textContent = Number.isInteger(score) ? formatModifier(modifierFor(score)) : "—";
      });
    }

    static #showResult(application, message, tone = "neutral") {
      const output = application.element.querySelector("[data-roll-result]");
      if (!output) return;
      output.textContent = message;
      output.dataset.tone = tone;
    }

    static async #onRollD20() {
      const result = rollD20();
      this.constructor.#showResult(this, `W20: ${result}`, "neutral");
      await postRollToChat({
        actor: this.document,
        title: "Allgemeiner W20-Wurf",
        dieResult: result,
      });
    }

    static async #onRollAttribute(event, button) {
      const attributeId = button.dataset.attributeId;
      const valueInput = this.element.querySelector(`[data-attribute-value="${attributeId}"]`);
      const targetInput = this.element.querySelector("[data-target]");
      try {
        const result = rollAttribute({
          attributeId,
          attributeValue: Number(valueInput?.value),
          target: targetInput?.value.trim() ? Number(targetInput.value) : Number.NaN,
        });
        const label = ABILITIES.find((ability) => ability.id === attributeId)?.label ?? attributeId;
        this.constructor.#showResult(this,
          `${label}: W20 ${result.dieResult} ${formatModifier(result.modifier)} = ${result.total} gegen SG ${result.target} — ${result.success ? "Erfolg" : "Misserfolg"}`,
          result.success ? "success" : "failure",
        );
        await postRollToChat({
          actor: this.document,
          title: `Attributsprobe: ${label}`,
          dieResult: result.dieResult,
          modifier: result.modifier,
          total: result.total,
          target: result.target,
          success: result.success,
        });
      } catch (error) {
        this.constructor.#showResult(this, `Wurf nicht möglich: ${error.message}`, "failure");
      }
    }

    static async #onSaveTestData() {
      const abilities = {};
      for (const ability of ABILITIES) {
        const input = this.element.querySelector(`[data-attribute-value="${ability.id}"]`);
        const score = Number(input?.value);
        if (!Number.isInteger(score) || score < 4 || score > 20) {
          this.constructor.#showResult(this, `${ability.label}: Wert muss eine ganze Zahl von 4 bis 20 sein.`, "failure");
          input?.focus();
          return;
        }
        abilities[ability.id] = score;
      }

      const targetInput = this.element.querySelector("[data-target]");
      const target = targetInput?.value.trim() ? Number(targetInput.value) : Number.NaN;
      if (!Number.isFinite(target)) {
        this.constructor.#showResult(this, "Der SG muss eine gültige Zahl sein.", "failure");
        return;
      }

      await this.document.setFlag(FLAG_SCOPE, FLAG_KEY, { abilities, target });
      this.constructor.#showResult(this, "Testwerte gespeichert.", "success");
    }
  }

  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    foundry.documents.Actor,
    game.system.id,
    MelliadorTestCharacterSheet,
    { types: ["character"], makeDefault: true },
  );
}
