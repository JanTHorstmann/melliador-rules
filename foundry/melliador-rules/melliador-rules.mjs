import { rollD20, rollAttribute } from "./scripts/core/index.js";
import { registerTestCharacterSheet } from "./module/test-character-sheet.mjs";
import { postRollToChat } from "./module/chat/roll-message.mjs";

Hooks.once("init", () => {
  game.melliadorRulesPrototype = Object.freeze({
    rollD20,
    rollAttribute,
    postRollToChat,
  });

  registerTestCharacterSheet({ rollD20, rollAttribute, postRollToChat });

  console.info("Melliador Rules prototype initialized.");
});
