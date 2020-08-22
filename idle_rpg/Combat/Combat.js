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
   useSkills,
   isPlayer,
   applyEffects,
   addAttrExp,
   secondaryAttributes,
} from "../Character/Character.js";
import { getRandomEnemy } from "../Adventure/Adventure.js";
import { messageAttack, messageDeath, messageBasic, messageAttackCritical } from "./LogMessages/logMessages.js";

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
         case "attack":
            log.appendChild(messageAttack(message));
            break;
         case "death":
            log.appendChild(messageDeath(message));
            break;
         case "critical":
            log.appendChild(messageAttackCritical(message));
            break;
         case "dodge":
         case "block":
         case "deflect":
            log.appendChild(messageBasic(message));
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
      let damage = attack(window.player, adventure.currentEnemy);
      subtractStatCurrent("health", damage, adventure.currentEnemy);

      // Check for enemy death
      if (getStat("health", adventure.currentEnemy).current <= 0) {
         enemyDefeated(adventure.currentEnemy);
         return;
      }
   }

   // Enemy attack
   const enemyJob = getJob(adventure.currentEnemy);
   if (combatTick != 0 && combatTick % enemyJob.attack.speed === 0) {
      let damage = attack(adventure.currentEnemy, window.player);
      subtractStatCurrent("health", damage);

      // Check for player death
      if (getStat("health").current <= 0) {
         logDeath(window.player);
      }
   }
}

function attack(attacker, defender) {
   let intialDamage = calculateDamage(getJob(attacker).attack, attacker, defender);
   const attackSummary = rollForOnHits(intialDamage, attacker, defender);

   logAttackItem(attackSummary.damage, attacker, defender, attackSummary);

   // award player for attack
   if (isPlayer(attacker)) {
      awardPlayerForAttack(attacker, defender);
   } else {
      awardPlayerForBeingHit(attackSummary, defender, attacker);
   }

   return attackSummary.damage;
}

function logAttackItem(damage, attacker, defender, attackSummary) {
   if (attackSummary.isDeflected) {
      logDeflect(damage, attacker.label, defender.label);
   } else if (attackSummary.isBlocked) {
      logBlock(damage, attacker.label, defender.label);
   } else if (attackSummary.isDodged) {
      logDodge(damage, attacker.label, defender.label);
   } else if (attackSummary.isCritical) {
      logAttackCritical(damage, attacker.label, defender.label);
   } else {
      logAttack(damage, attacker.label, defender.label);
   }
}

function awardPlayerForAttack(player, defender) {
   const job = getJob(player);
   for (const attr of job.attack.dmgModifiers) {
      const exp = attr.modifier * defender.reward.exp;
      addAttrExp(attr.name, exp);
   }
}

function awardPlayerForBeingHit(attackSummary, player, defender) {
   const hitRewards = [{ name: "str", modifier: 0.4 }];

   if (attackSummary.isDeflected) {
      deriveFromSecondaryAttributes(secondaryAttributes.deflect, defender);
   } else if (attackSummary.isBlocked) {
      deriveFromSecondaryAttributes(secondaryAttributes.block, defender);
   } else if (attackSummary.isDodged) {
      deriveFromSecondaryAttributes(secondaryAttributes.dodge, defender);
   } else {
      for (const attr of hitRewards) {
         const exp = attr.modifier * defender.reward.exp;
         addAttrExp(attr.name, exp);
      }
   }
}

function deriveFromSecondaryAttributes(secondAttr, defender) {
   console.log(secondAttr)
   for (const attr of secondAttr.attributes) {
      if (attr.name !== "lck") {
         const exp = attr.modifier * defender.reward.exp * 10000;
         console.log(`Giving ${attr.name} ${exp} exp`)
         addAttrExp(attr.name, exp);
      }
   }
}

function enemyDefeated(currentEnemy) {
   awardPlayer(currentEnemy);

   logDeath(currentEnemy.label);
   // Clear enemy
   setCurrentEnemy();

   // Move ahead
   addAdventureProgress(1);
}

function awardPlayer(enemy) {
   useSkills("onKill", enemy);
   addJobExp(enemy.reward.exp);
}

export function getAttackDamageRange(job) {
   const attack = job.attack;
   let baseDmg = 0;
   for (const attr of attack.dmgModifiers) {
      baseDmg += getAttr(attr.name).level * attr.modifier;
   }

   // Add variance
   const min = (1 - attack.variance) * baseDmg;
   const max = (1 + attack.variance) * baseDmg;

   return { min: Math.floor(min), max: Math.ceil(max) };
}

export function calculateDamage(attack, attacker, defender) {
   let baseDmg = 0;
   let finalDmg;

   for (const attr of attack.dmgModifiers) {
      baseDmg += getAttr(attr.name).level * attr.modifier;
   }

   // Add variance
   const variance = 1 - attack.variance + Math.random() * attack.variance * 2;

   finalDmg = baseDmg * variance;

   return finalDmg;
}

export function rollForOnHits(damage, attacker, defender) {
   let isCritical,
      isBlocked,
      isDodged,
      isDeflected = false;
   const attack = attacker.jobs[attacker.job].attack;
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
   isCritical = critRoll <= critChance;
   isBlocked = blockRoll <= blockChance;
   isDeflected = deflectRoll <= deflectChance;
   isDodged = dodgeRoll <= dodgeChance;

   if (isCritical) {
      finalDmg = finalDmg * attack.criticalDamage;
   }

   // Check for block
   // If Block then check for deflect
   if (isBlocked) {
      finalDmg = 0;
      if (isDeflected) {
         // Deflect
      }
   }

   // Check for dodge
   if (isDodged) {
      useSkills("onDodge", { damage, attacker, defender });
      finalDmg = 0;
   }

   return { isCritical, isBlocked, isDodged, isDeflected, damage: finalDmg };
}

export function logDodge(damage, source, enemy) {
   sendMessage({
      type: "combat",
      component: "dodge",
      value: damage,
      enemy,
      effect: " dodged attack",
      source,
   });
}
export function logBlock(damage, source, enemy) {
   sendMessage({
      type: "combat",
      component: "block",
      value: damage,
      enemy,
      effect: " blocked attack",
      source,
   });
}

export function logDeflect(damage, source, enemy) {
   sendMessage({
      type: "combat",
      component: "deflect",
      value: damage,
      enemy,
      effect: " deflected attack",
      source,
   });
}

export function logAttackCritical(damage, source, enemy) {
   sendMessage({ type: "combat", component: "critical", source, value: damage, enemy });
}

export function logAttack(damage, source, enemy) {
   if (damage > 0) sendMessage({ type: "combat", component: "attack", source, value: damage, enemy });
}

export function logDeath(source) {
   sendMessage({ type: "combat", component: "death", source, effect: " died" });
}

export function sendMessage(message) {
   const event = new CustomEvent("log-message", { detail: message });
   document.dispatchEvent(event);
}
