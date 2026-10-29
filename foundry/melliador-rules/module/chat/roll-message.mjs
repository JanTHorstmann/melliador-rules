function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

/** Post a previously calculated result without rerolling its die. */
export async function postRollToChat({
  actor,
  title,
  dieResult,
  modifier = 0,
  total = dieResult + modifier,
  target,
  success,
}) {
  if (!actor) throw new TypeError("actor is required to post a roll");
  if (typeof title !== "string" || !title.trim()) throw new TypeError("title is required");
  if (!Number.isInteger(dieResult) || dieResult < 1 || dieResult > 20) {
    throw new RangeError("dieResult must be an integer from 1 through 20");
  }
  if (!Number.isInteger(modifier) || !Number.isFinite(total)) {
    throw new TypeError("modifier and total must be finite numbers");
  }

  const hasTarget = target !== undefined;
  const hasSuccess = success !== undefined;
  if (hasTarget !== hasSuccess || (hasTarget && (!Number.isFinite(target) || typeof success !== "boolean"))) {
    throw new TypeError("target and success must be provided together for a check");
  }
  const isCheck = hasTarget;
  const safeTitle = escapeHtml(title.trim());
  const tone = success === true ? "success" : success === false ? "failure" : "neutral";
  const targetLine = isCheck
    ? `<div class="melliador-roll-target">SG ${escapeHtml(target)} <strong>${success ? "Erfolg" : "Misserfolg"}</strong></div>`
    : "";
  const content = `
    <section class="melliador-chat-roll" data-result="${tone}">
      <header class="melliador-chat-roll__header">
        <span class="melliador-chat-roll__die-icon" aria-hidden="true">d20</span>
        <strong>${safeTitle}</strong>
      </header>
      <div class="melliador-chat-roll__breakdown">
        <div><span>W20</span><strong>${dieResult}</strong></div>
        <span class="melliador-chat-roll__operator">${modifier < 0 ? "−" : "+"}</span>
        <div><span>Modifikator</span><strong>${Math.abs(modifier)}</strong></div>
        <span class="melliador-chat-roll__operator">=</span>
        <div class="melliador-chat-roll__total"><span>Gesamt</span><strong>${escapeHtml(total)}</strong></div>
      </div>
      ${targetLine}
    </section>`;

  const message = {
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: safeTitle,
    content,
  };
  const messageMode = game.settings.get("core", "messageMode") ?? "public";
  return ChatMessage.create(message, { messageMode });
}
