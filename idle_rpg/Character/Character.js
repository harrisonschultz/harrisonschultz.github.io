import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from "../theme.js";
import { adventures } from "../adventures.js";
import { JobsDetails } from "../JobsDetails/JobsDetails.js";
import { CharacterStatus } from "../components/CharacterStatus/CharacterStatus.js";
import { playerDeath, enemyDefeated } from "../Combat/Combat.js";

const STR_HEALTH_MODIFIER = 1;
const INT_MANA_MODIFIER = 1;
const AGI_STAMINA_MODIFIER = 1;
const SKILL_LIMIT = 5;

(async () => {
   const res = await fetch("./Character/Character.html");
   const textTemplate = await res.text();
   const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

   class Character extends HTMLElement {
      constructor() {
         super();

         if (window.player) {
            this.attrs = window.player.attrs;
            this.level = window.player.level;
            this.stats = window.player.stats;
         }

         document.addEventListener("attr-level", () => this.setMaxStat("health", "str", STR_HEALTH_MODIFIER));
         document.addEventListener("attr-level", () => this.setMaxStat("mana", "int", INT_MANA_MODIFIER));
         document.addEventListener("attr-level", () => this.setMaxStat("stamina", "agi", AGI_STAMINA_MODIFIER));
         document.addEventListener("attr-level", this.render);
         document.addEventListener("status-changed", this.renderBuffs);
         document.addEventListener("time-elapsed", this.renderBuffs);
         document.addEventListener("gold-changed", this.renderGold);
      }

      connectedCallback() {
         const shadowRoot = this.attachShadow({ mode: "open" });

         // Clone the template and the cloned node to the shadowDOM's root.
         const instance = HTMLTemplate.content.cloneNode(true);
         shadowRoot.appendChild(instance);

         this.initialRender();
      }

      initialRender = () => {
         // Status
         const characterStatus = new CharacterStatus();
         this.shadowRoot.getElementById("status-container").appendChild(characterStatus);

         // Job details
         const jobDetails = new JobsDetails(undefined, { self: true });
         this.shadowRoot.getElementById("character-jobs-details").appendChild(jobDetails);

         const goldContainer = this.shadowRoot.getElementById("gold-container");
         const goldLabel = document.createElement("div");
         const goldValue = document.createElement("div");
         goldContainer.appendChild(goldLabel);
         goldContainer.appendChild(goldValue);

         goldContainer.className = "gold-container container";
         goldLabel.className = "attribute-label";
         goldValue.className = "attribute-value";

         goldLabel.innerHTML = "Gold";
         goldValue.id = "gold-value";
         goldValue.innerHTML = getGold();

         // Attribute bars
         const attrContainer = this.shadowRoot.getElementById("attributes-container");
         for (const s in window.player.attrs) {
            const attr = window.player.attrs[s];
            const attrRow = document.createElement("div");
            const detailDiv = document.createElement("div");
            const labelDiv = document.createElement("div");
            const valueDiv = document.createElement("div");
            const barDiv = document.createElement("div");

            attrRow.className = "attribute";
            detailDiv.className = "attribute-details";
            labelDiv.className = "attribute-label";
            labelDiv.innerHTML = attr.label;
            valueDiv.className = "attribute-value";
            valueDiv.id = s;
            barDiv.className = "bar";
            barDiv.id = `${s}-bar`;

            const attrBar = new ProgressBar(
               "attr-changed",
               () => getAttrProgress(s),
               theme.colors.pastelGreen,
               { value: false },
               { height: "4px" }
            );
            attrBar.className = "bar";

            attrContainer.appendChild(attrRow);
            attrRow.appendChild(detailDiv);
            detailDiv.appendChild(labelDiv);
            detailDiv.appendChild(valueDiv);
            attrRow.appendChild(barDiv);
            barDiv.appendChild(attrBar);
         }

         this.render();
      };

      /*
      @param - Heal sets whether or not increase max hp also raises current by the same amount.
    */

      setMaxStat(stat, attr, mod, heal = true) {
         // Strength increases max hp.
         // Maybe also job modifier?
         const health = getStat(stat);
         const str = getAttr(attr);
         const strHealthModifier = mod;
         const baseHp = 1;
         let newHealthMax;
         let healthIncrease = 0;

         newHealthMax = str.level * strHealthModifier;
         if (health.max !== newHealthMax) {
            const healthDifference = newHealthMax - health.max;
            const newHealth = { ...health };
            newHealth.max = newHealthMax;

            if (heal) {
               newHealth.current += healthDifference;
            }

            setStat(stat, newHealth);
            this.render();
         }
      }

      renderGold = () => {
         const goldValue = this.shadowRoot.getElementById("gold-value");
         goldValue.innerHTML = getGold();
      };

      render = () => {
         if (this.shadowRoot) {
            for (var key in player.attrs) {
               this.shadowRoot.getElementById(key).innerHTML = player.attrs[key].level;
            }
         }

         // Status (Buffs/Debuffs)
         const buffsContainer = this.shadowRoot.getElementById("buffs-container");
      };
   }

   customElements.define("character-sheet", Character);
})();

export function getMaxHealth(actions) {
   window.player.availableActions = actions;
}

export function setAvailableActions(actions) {
   window.player.availableActions = actions;
}

export function getStat(stat, char = window.player) {
   return char.stats[stat];
}

export function setStat(stat, statData, char = window.player) {
   char.stats[stat] = statData;
   statChange();
}

export function completeAdventure(char = window.player) {
   char.completedAdventures.push(getAdventure().prop);
   addGold(getAdventure().goldAward, char);
   resetAdventure();
   adventureChanged();
   setAction("rest");
}

export function addGold(value, char = window.player) {
   char.gold += value;
   goldChange();
}

export function payGold(value, char = window.player) {
   const newValue = char.gold - value;
   if (newValue >= 0) {
      char.gold = newValue;
      goldChange();
      return true;
   }
   return false;
}

export function setCurrentEnemy(enemy) {
   window.player.adventure.currentEnemy = enemy;
   enemyChanged();
}

export function enemyChanged(data = {}) {
   const event = new CustomEvent("enemy-changed", data);
   document.dispatchEvent(event);
}

export function addStatCurrent(stat, value, char = window.player) {
   char.stats[stat].current = char.stats[stat].current + value;

   if (char.stats[stat].current > char.stats[stat].max) {
      char.stats[stat].current = char.stats[stat].max;
   } else if (char.stats[stat].current < 0) {
      char.stats[stat].current = 0;
   }
   statChange();
}

export function subtractStatCurrent(stat, value, char = window.player) {
   char.stats[stat].current = char.stats[stat].current - value;

   if (char.stats[stat].current > char.stats[stat].max) {
      char.stats[stat].current = char.stats[stat].max;
   } else if (char.stats[stat].current < 0) {
      char.stats[stat].current = 0;
   }
   statChange();
}

export function applyOverTimeEffects(char) {
   applyEffects(
      "overTime",
      {
         char,
      },
      char
   );

   const adventure = getAdventure();
   if (adventure && adventure.currentEnemy) {
      // Check for enemy death
      if (getStat("health", adventure.currentEnemy).current <= 0) {
         enemyDefeated(adventure.currentEnemy);
      }
   }

   // Player death
   if (getStat("health").current <= 0) {
      playerDeath();
   }

   statChange();
}

export function getGold(char = window.player) {
   return char.gold;
}

export function getAttr(attr, char = window.player) {
   return char.attrs[attr];
}

export function getJobProgress(char = window.player, jobName = undefined) {
   let job = getJob();
   if (jobName) {
      job = getAnyJob(jobName, char);
   }
   return { current: job.level.exp, max: job.level.expNeeded };
}

export function getAnyJob(jobName, char = window.player) {
   return char.jobs[jobName];
}

export function getStats(char = window.player) {
   return char.stats;
}

export function regenerateStats(char = window.player) {
   addStatCurrent("mana", 0.2, char);
   addStatCurrent("stamina", 0.2, char);
   statChange();
}

export function getJob(char = window.player) {
   return char.jobs[char.job];
}

export function addJobExp(exp, level = false) {
   const job = getJob();
   // Higher tier jobs require more exp
   const expMultiplier = job.tier / 2;

   // Add exp and handle levels
   const totalExpNeeded = 1 * Math.pow(1.09, job.level.level * expMultiplier);
   const currentExp = job.level.exp;
   const expLeft = totalExpNeeded - (exp + currentExp);

   // Set the expNeeded
   job.level.expNeeded = totalExpNeeded;

   if (expLeft < 0) {
      // If expLeft is less than zero than we have leveled up
      // Recursively call the function to continue to level.
      // Base case is when exp amount does not cause us to level up.
      job.level.level++;
      job.level.exp = 0;
      addJobExp(Math.abs(expLeft), true);
   } else {
      // Base case hit, call send out event for components to render.
      job.level.exp = currentExp + exp;
      jobProgress();
      if (level) {
         levelUpJob();
      }
   }
}

export function levelUpJob() {
   // Add skill points
   getJob().skillPoints++;

   jobLevel();
}

export function getJobs(char = window.player) {
   return char.jobs;
}

export function setJob(job) {
   window.player.job = job;
   jobChanged();
   jobProgress();
}

export function getSkillPoints(jobName) {
   return window.player.jobs[jobName].skillPoints;
}

export function setCombatStartTick(tick) {
   window.player.combatStartTick = tick;
}

export function getCombatStartTick() {
   return window.player.combatStartTick;
}

export function getSecondaryAttribute(prop, char = window.player) {
   const attr = secondaryAttributes[prop];

   return getSecondaryAttributeValue(attr, char);
}

export function getSkills(char = window.player, type = undefined) {
   if (type && char.skills) {
      return char.skills.filter((skill) => type === skill.type);
   }
   return char.skills;
}

export function isSkillEquipped(skill) {
   return !!window.player.skills.find((s) => s.key === skill.key);
}

export function isSkillUnlocked(skill, job) {
   return skill.levelNeeded <= job.level.level;
}

export function unequipSkill(skill) {
   if (isSkillEquipped(skill)) {
      window.player.skills = window.player.skills.filter((s) => {
         return s.key !== skill.key;
      });
   }
   skillEquipped();
}

export function isSkillLimitReached() {
   return window.player.skills.length >= SKILL_LIMIT;
}

export function equipSkill(skill) {
   if (!isSkillEquipped(skill) && !isSkillLimitReached()) {
      window.player.skills.push(skill);
   }
   skillEquipped();
}

export function isClassUnlocked(job) {
   return checkRequirements(job);
}

export function checkRequirements(job) {
   for (const req of job.requirements) {
      switch (req.type) {
         case "job":
            if (!(getAnyJob(req.name).level.level >= req.level)) return false;
            break;
         case "attribute":
            if (!(getAttr(req.name).level >= req.level)) return false;
            break;
         default:
            break;
      }
   }
   return true;
}

export function useSkills(type, data) {
   const skills = getSkills();

   for (const skill of skills) {
      if (skill.type === type) {
         data = skill.func(data);
      }
   }

   return data;
}

export function isPlayer(char) {
   if (typeof char === "object") {
      return char.label === "You";
   } else {
      return char === "You";
   }
}

export function getEffects(char = window.player) {
   return char.effects;
}

export function getEffect(effect, char = window.player) {
   return char.effects.find((e) => e.key === effect.key);
}

export function applyEffects(type, data, char = window.player) {
   const effects = getEffects(char) || [];
   let returnValue = undefined;

   for (const eff of effects) {
      if (eff.type === type) {
         returnValue = eff.func(data);
      }
   }

   if (returnValue) {
      return returnValue;
   }
}

export function getSecondaryAttributeValue(secondaryAttr, char = window.player) {
   let value = 0;
   for (const a of secondaryAttr.attributes) {
      value += 1 * Math.pow(1.09, getAttr(a.name, char).level * a.modifier * 0.5);
   }

   const appliedValue = applyEffects(secondaryAttr.key, value, char) || value;

   if (appliedValue) {
      value = appliedValue;
   }

   return value;
}

export function getAttrProgress(attr) {
   return { current: window.player.attrs[attr].exp, max: window.player.attrs[attr].expNeeded };
}

export function addAttrExp(attr, exp, level = false) {
   const { attrs } = window.player;

   // Add exp and handle levels
   const totalExpNeeded = 1 * Math.pow(1.09, attrs[attr].level);
   const currentExp = attrs[attr].exp;
   const expLeft = totalExpNeeded - (exp + currentExp);

   // Set the expNeeded
   attrs[attr].expNeeded = totalExpNeeded;

   if (expLeft < 0) {
      // If expLeft is less than zero than we have leveled up
      // Recursively call the function to continue to level.
      // Base case is when exp amount does not cause us to level up.
      attrs[attr].level++;
      attrs[attr].exp = 0;
      addAttrExp(attr, Math.abs(expLeft), true);
   } else {
      // Base case hit, call send out event for components to render.
      attrs[attr].exp = currentExp + exp;
      attrChange();
      if (level) {
         attrLevel();
      }
   }
}

export function modifyStat(stat, value, whenResourcesEmpty = undefined, whenResourcesMax = undefined) {
   const { stats } = window.player;
   stats[stat].current += value;

   if (stats[stat].current > stats[stat].max) {
      stats[stat].current = stats[stat].max;
      if (whenResourcesMax) {
         whenResourcesMax();
      }
   }

   if (stats[stat].current < 0) {
      stats[stat].current = 0;
      if (whenResourcesEmpty) {
         whenResourcesEmpty();
      } else {
         // By default just stop the action
         setAction("rest");
      }
   }

   statChange();
}

export function rest() {
   const { stats } = window.player;
   const statsComplete = [];

   // Restore all stats by a percentage
   for (const stat in window.player.stats) {
      // Restore each stat by 5%
      stats[stat].current += stats[stat].max * 0.05;

      // When stat is max
      if (stats[stat].current > stats[stat].max) {
         stats[stat].current = stats[stat].max;
         statsComplete.push(stat);
      }
   }

   // Finished Resting
   if (statsComplete.length === Object.keys(window.player.stats).length) {
      setAction(window.player.prevAction);
   }

   useSkills("onRest");

   statChange();
}

export function setAction(action) {
   window.player.prevAction = window.player.action;
   window.player.action = action;

   if (action === "rest") {
      // Reset adventure progress on rest
      resetAdventure();
   }

   actionChange();
}

export function resetAdventure() {
   if (window.player.adventure) {
      window.player.adventure.currentEnemy = undefined;
      window.player.adventure.progress.current = 0;
      adventureProgress();
   }
}

export function getAdventure() {
   return window.player.adventure;
}

export function getCurrentEnemy() {
   return window.player.adventure.currentEnemy;
}

export function getAdventureProgress() {
   return window.player.adventure.progress;
}

export function determineAttack(char = window.player) {
   const skills = getSkills(char, "attack") || [];
   const readySkills = []; // Store attacks that can be used.

   for (const skl of skills) {
      if (isSkillReady(skl, char)) {
         readySkills.push(skl);
      }
   }

   // Randomly choose one? I guess for now.
   const randomIndex = Math.floor(Math.random() * readySkills.length);
   const skill = readySkills[randomIndex];

   if (skill) {
      // Pay for it
      paySkill(skill);
      // If no skill is available just normal attack.
      return { attack: skill.attack, skill };
   } else {
      return { attack: getJob(char).attack };
   }
}

export function paySkill(skill) {
   if (skill.cost) {
      for (const cost of skill.cost)
         switch (cost.type) {
            case "stat":
               modifyStat(cost.name, cost.value);
               break;
            default:
               break;
         }
   }

   startCooldown(skill);
}

export function startCooldown(skill, char = window.player) {
   if (skill.cooldown) {
      char.cooldowns = char.cooldowns || {};
      char.cooldowns[skill.key] = skill.cooldown;
   }
}

export function isSkillReady(skill, char = window.player) {
   let ready = true;

   // Check custom ready conditions
   if (skill.isReady && !skill.isReady()) {
      return false;
   }

   // Check cooldowns
   if (skill.cooldown && char.cooldowns && char.cooldowns[skill.key] && char.cooldowns[skill.key] > 0) {
      return false;
   }

   // Check standard conditions
   if (skill.cost) {
      for (const cost of skill.cost) {
         switch (cost.type) {
            case "stat":
               if (!hasEnoughStat(cost.name, cost.value, char)) {
                  return false;
               }
               break;
            default:
               break;
         }
      }
   }

   return ready;
}

export function hasEnoughStat(stat, value, char = window.player) {
   return getStat(stat, char).current >= Math.abs(value);
}

export function addAdventureProgress(val) {
   const { progress } = window.player.adventure;
   let newDistance = progress.current + val;

   if (newDistance > progress.max) {
      completeAdventure();
   } else {
      setAdventureProgress(newDistance);
   }
}

export function setAdventureProgress(val) {
   window.player.adventure.progress.current = val;
   adventureProgress();
}

export function setAdventure(adv) {
   window.player.adventure = { ...adv };
   adventureChanged();
   adventureProgress();
}

export function elapseTime() {
   const chars = [window.player];
   const adventure = getAdventure();
   if (adventure && adventure.currentEnemy) {
      chars.push(adventure.currentEnemy);
   }
   for (const char of chars) {
      for (const eff of char.effects) {
         // Buffs and debuffs
         applyOverTimeEffects(char);
         if (eff.duration <= 0) {
            removeEffect(eff, char);
         } else {
            eff.duration--;
         }
      }
      // Cooldowns
      tickCooldowns(char);

      // Stat Regen
      regenerateStats(char);
   }
   timeElapsed();
}

export function tickCooldowns(char = window.player) {
   if (char.cooldowns) {
      for (const cd in char.cooldowns) {
         // Subtract 1 from the cooldown
         char.cooldowns[cd] = char.cooldowns[cd] - 1;
         if (char.cooldowns[cd] < 1) {
            delete char.cooldowns[cd];
         }
      }
   }
}

export function removeEffect(effect, char = window.player) {
   char.effects = char.effects.filter((eff) => eff.key !== effect.key);
   statusChanged();
}

export function addEffect(effect, char = window.player) {
   const found = char.effects.find((e) => e.key === effect.key);
   if (found) {
      found.duration = found.durationOnRefresh;
   } else {
      char.effects.push({ ...effect });
   }
   statusChanged();
}

export function actionChange(data = {}) {
   const event = new CustomEvent("action-changed", data);
   document.dispatchEvent(event);
}

export function charChange(data = {}) {
   const event = new CustomEvent("character-changed", data);
   document.dispatchEvent(event);
}

export function statChange(data = {}) {
   const event = new CustomEvent("stat-changed", data);
   document.dispatchEvent(event);
}

export function jobLevel(data = {}) {
   const event = new CustomEvent("job-level", data);
   document.dispatchEvent(event);
}

export function jobProgress(data = {}) {
   const event = new CustomEvent("job-progress", data);
   document.dispatchEvent(event);
}

export function attrChange(data = {}) {
   const event = new CustomEvent("attr-changed", data);
   document.dispatchEvent(event);
}

export function adventureChanged(data = {}) {
   const event = new CustomEvent("adventure-changed", data);
   document.dispatchEvent(event);
}

export function adventureProgress(data = {}) {
   const event = new CustomEvent("adventure-progress", data);
   document.dispatchEvent(event);
}

export function attrLevel(data = {}) {
   const event = new CustomEvent("attr-level", data);
   document.dispatchEvent(event);
}

export function jobChanged(data = {}) {
   const event = new CustomEvent("job-changed", data);
   document.dispatchEvent(event);
}

export function skillEquipped(data = {}) {
   const event = new CustomEvent("skill-equipped", data);
   document.dispatchEvent(event);
}

export function skillUnlocked(data = {}) {
   const event = new CustomEvent("skill-unlocked", data);
   document.dispatchEvent(event);
}

export function goldChange(data = {}) {
   const event = new CustomEvent("gold-changed", data);
   document.dispatchEvent(event);
}

export function statusChanged(data = {}) {
   const event = new CustomEvent("status-changed", data);
   document.dispatchEvent(event);
}

export function timeElapsed(data = {}) {
   const event = new CustomEvent("time-elapsed", data);
   document.dispatchEvent(event);
}

export const secondaryAttributes = {
   criticalChance: {
      label: "Critical Chance",
      key: "criticalChance",
      attributes: [
         { name: "per", modifier: 0.1 },
         { name: "lck", modifier: 0.8 },
      ],
   },
   dodge: {
      label: "Dodge",
      key: "dodge",
      attributes: [
         { name: "per", modifier: 0.1 },
         { name: "agi", modifier: 0.07 },
         { name: "lck", modifier: 0.8 },
      ],
   },
   block: {
      label: "Block",
      key: "block",
      attributes: [
         { name: "per", modifier: 0.1 },
         { name: "str", modifier: 0.05 },
         { name: "agi", modifier: 0.05 },
         { name: "lck", modifier: 0.8 },
      ],
   },
   deflect: {
      label: "Deflect",
      key: "deflect",
      attributes: [
         { name: "str", modifier: 0.15 },
         { name: "agi", modifier: 0.08 },
         { name: "lck", modifier: 0.8 },
      ],
   },
};
