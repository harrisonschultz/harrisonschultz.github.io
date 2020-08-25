import { jobs } from "./Jobs/Jobs.js";
import { addEffect, getAnyJob, getStat } from "./Character/Character.js";
import { effects } from "./effects.js";
import { load } from "./core.js";

export function initialize() {
   const state = load();
   if (state) {
      window.player = state;
   } else {
      window.player = {
         prevAction: "rest",
         action: "rest",
         label: "You",
         tab: "Train",

         attrs: {
            agi: { label: "Agility", level: 1, exp: 0, expNeeded: 1.1 },
            int: { label: "Intelligence", level: 1, exp: 0, expNeeded: 1.1 },
            lck: { label: "Luck", level: 1, exp: 0, expNeeded: 1.1 },
            per: { label: "Perception", level: 1, exp: 0, expNeeded: 1.1 },
            str: { label: "Strength", level: 1, exp: 0, expNeeded: 1.1 },
         },

         job: "child",

         jobs: jobs,

         adventure: undefined,
         adventures: [],
         completedAdventures: [],
         effects: [],
         skills: [{
            type: "onKill",
            label: "Apex Predator",
            key: "apexPredator",
            levelNeeded: 10,
            func: () => {
               const apexPredator = { ...effects.apexPredator };
               addEffect(apexPredator);
            },
            flavor: "placeholder",
            description:
               "A whip of searing heat strikes your foe dealing 1.5x of your intelligence and applying a burning debuff",
         },],
         skillsUnlocked: [],

         stats: {
            health: { current: 1, max: 1 },
            stamina: { current: 1, max: 1 },
            mana: { current: 1, max: 1 },
            fatigue: { current: 10, max: 10 },
         },
      };
   }
}
