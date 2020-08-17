import {
  getAttr,
  getJob,
  subtractStatCurrent,
  setCombatStartTick,
  getCombatStartTick,
  setCurrentEnemy,
  getSecondaryAttribute,
  addAdventureProgress,
  getAdventure,
  getStat,
  setAction,
  addJobExp,
} from "../Character/Character.js";
import { getRandomEnemy } from "../Adventure/Adventure.js";
import {
  messagePlayerAttack,
  messagePlayerHit,
  messageEnemyDeath,
  messagePlayerDeath,
} from "./LogMessages/logMessages.js";

const LOG_MAX = 50;

export class Combat extends HTMLElement {
  constructor() {
    super();

    document.addEventListener("log-message", this.appendToLog);
  }

  async connectedCallback() {
    const res = await fetch("./Combat/Combat.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);
    this.render();
  }

  render = () => {};

  appendToLog = (data) => {
    const log = this.shadowRoot.getElementById("log");
    const message = data.detail;

    switch (message.component) {
      case "playerHit":
        log.appendChild(messagePlayerHit(message));
        break;
      case "playerAttack":
        log.appendChild(messagePlayerAttack(message));
        break;
      case "playerDeath":
        log.appendChild(messagePlayerDeath(message));
        break;
      case "enemyDeath":
        log.appendChild(messageEnemyDeath(message));
        break;
      default:
        break;
    }

    // Clean old messages
    while (log.children.length > LOG_MAX) {
      log.removeChild(log.firstChild);
    }

    // Scroll
    log.scrollTop = log.scrollHeight;
  };
}

customElements.define("combat-sheet", Combat);

export function fight(tick) {
  const adventure = getAdventure();
  // Get a random enemy from the current adventure
  if (!adventure.currentEnemy) {
    setCurrentEnemy(getRandomEnemy(adventure));
    setCombatStartTick(tick);
  }

  const combatTick = tick - getCombatStartTick();

  // Check for attacks
  // Player always attack first if both attack at the same time
  // Player attack
  const playerJob = getJob();
  if (combatTick != 0 && combatTick % playerJob.attack.speed === 0) {
    let damage = calculateDamage(playerJob.attack, window.player, adventure.currentEnemy);
    damage = rollForOnHits(damage, window.player, adventure.currentEnemy);
    subtractStatCurrent("health", damage, adventure.currentEnemy);
    logPlayerAttack(damage, adventure.currentEnemy.label);

    // Check for enemy death
    if (getStat("health", adventure.currentEnemy).current <= 0) {
      enemyDefeated(adventure.currentEnemy);
      return;
    }
  }

  // Enemy attack
  const enemyJob = getJob(adventure.currentEnemy);
  if (combatTick != 0 && combatTick % enemyJob.attack.speed === 0) {
    let damage = calculateDamage(enemyJob.attack, adventure.currentEnemy, window.player);
    damage = rollForOnHits(damage, adventure.currentEnemy, window.player);
    logPlayerHit(damage, adventure.currentEnemy.label);
    subtractStatCurrent("health", damage);

    // Check for player death
    if (getStat("health").current <= 0) {
      playerDeath(adventure.currentEnemy);
    }
  }
}

function enemyDefeated(currentEnemy) {
  awardPlayer(currentEnemy);

  logEnemyDeath(currentEnemy.label);
  // Clear enemy
  setCurrentEnemy();

  // Move ahead
  addAdventureProgress(1);
}

function playerDeath() {
  logPlayerDeath();
  setAction("rest");
}

function awardPlayer(enemy) {
  addJobExp(enemy.reward.exp);
}

export function calculateDamage(attack, attacker, defender) {
  let baseDmg = 0;
  let finalDmg;

  for (const attr of attack.dmgModifiers) {
    baseDmg += getAttr(attr.name).level * attr.modifier;
  }

  // Add variance

  finalDmg = baseDmg;

  return finalDmg;
}

export function rollForOnHits(damage, attacker, defender) {
  const attack = attacker.job.attack
  let finalDmg = damage;

  const critChance = getSecondaryAttribute("criticalChance", attacker);
  const blockChance = getSecondaryAttribute("block", defender);
  const deflectChance = getSecondaryAttribute("deflect", defender);
  const dodgeChance = getSecondaryAttribute("dodge", defender);

  // Roll for on hit effects
  const critRoll = Math.random() * 100;
  const blockRoll = Math.random() * 100;
  const deflectRoll = Math.random() * 100;
  const dodgeRoll = Math.random() * 100;

  // Check rolls
  if (critRoll <= critChance) {
    finalDmg = finalDmg * attack.criticalDamage;
  }

  // Check for block
  // If Block then check for deflect
  if (blockRoll <= blockChance) {
    finalDmg = 0;
    if (deflectRoll <= deflectChance) {
      // Deflect
    }
  }

  // Check for dodge
  if (dodgeRoll <= dodgeChance) {
    finalDmg = 0;
  }

  return finalDmg;
}

export function logPlayerHit(damage, enemy) {
  if (damage != 0) {
    sendMessage({ type: "combat", affects: "player", component: "playerHit", value: damage, enemy });
  }
}

export function logPlayerAttack(damage, enemy) {
  if (damage != 0) {
    sendMessage({ type: "combat", affects: "enemy", component: "playerAttack", value: damage, enemy });
  }
}

export function logPlayerDeath() {
  sendMessage({ type: "combat", affects: "player", component: "playerDeath", effect: " died" });
}

export function logEnemyDeath(enemy) {
  sendMessage({ type: "combat", affects: "enemy", component: "enemyDeath", enemy, effect: " died" });
}

export function sendMessage(message) {
  const event = new CustomEvent("log-message", { detail: message });
  document.dispatchEvent(event);
}
