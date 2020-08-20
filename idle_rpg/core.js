import { effects } from "./effects.js";
import { jobs } from "./Jobs/Jobs.js";

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
      const newEffects = Array()
      for (let effect of player.effects) {
         effect.func = effects[effect.key].func;
         newEffects.push(effect)
      }
      player.effects = newEffects
      
      return player;
   } else {
      return undefined
   }
}
