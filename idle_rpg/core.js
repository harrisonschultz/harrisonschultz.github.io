import { effects } from "./effects.js";
import { jobs } from "./Jobs/Jobs.js";
import { TICK_RATE } from "./main.js";

export function save() {
   window.localStorage.setItem("state", JSON.stringify(window.player));
}

export function load() {
   const state = window.localStorage.getItem("state");
   if (state) {
      const player = JSON.parse(state);

      // Functions cannot be parsed from JSON so objects with functions on them need to be reloaded
      for (const job in player.jobs) {
         player.jobs[job] = { ...jobs[job], ...player.jobs[job] };

         // Copy the functions
         for (const skill of player.jobs[job].skills) {
            const fullSkill = jobs[job].skills.find((x) => x.key === skill.key);
            if (fullSkill) {
               skill.func = fullSkill.func;
            }
         }
      }

      // Copy the functions
      const flatSkillArray = Object.keys(jobs).reduce((flatArray, jobName) => {
         return flatArray.concat(jobs[jobName].skills);
      }, []);

      for (const skill of player.skills) {
         const fullSkill = flatSkillArray.find((x) => x.key === skill.key);
         if (fullSkill) {
            skill.func = fullSkill.func;
         }
      }

      // Functions cannot be parsed from JSON so objects with functions on them need to be reloaded
      const playerEffects = Array();
      const enemyEffects = Array();
      for (let effect of player.effects) {
         effect.func = effects[effect.key].func;
         playerEffects.push(effect);
      }

      if (player.adventure && player.adventure.currentEnemy) {
         player.adventure.currentEnemy.effects = player.adventure.currentEnemy.effects || [];
         for (let effect of player.adventure.currentEnemy.effects) {
            effect.func = effects[effect.key].func;
            enemyEffects.push(effect);
         }
         player.adventure.currentEnemy.effects = enemyEffects;
      }
      player.effects = playerEffects;

      return player;
   } else {
      return undefined;
   }
}

export function getValueInSeconds(numberOfTicks) {
   const ticksPerSecond = 1000 / TICK_RATE;
   return numberOfTicks / ticksPerSecond;
}

export function accumulateValueInSeconds(rate) {
   const ticksPerSecond = 1000 / TICK_RATE;
   return (rate * ticksPerSecond).toFixed(2);
}
