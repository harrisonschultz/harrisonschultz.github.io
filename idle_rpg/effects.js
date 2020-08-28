import { secondaryAttributes, getAnyJob, getStat, setStat } from "./Character/Character.js";

export const effects = {
   opportunistic: {
      label: "Opportunistic",
      key: "opportunistic",
      type: "criticalChance",
      func: (data) => 100,
      duration: 25,
      durationOnRefresh: 25,
   },

   flameLash: {
      label: "Flame Lash",
      key: "flameLash",
      type: "overTime",
      func: ({ char }) => {
         const stat = getStat("health", char);
         stat.current = stat.current - stat.max * 0.005 * getAnyJob("student").level.level;
         setStat("health", stat, char);
      },
      duration: 80,
      durationOnRefresh: 80,
   },

   apexPredator: {
      label: "ApexPredator",
      key: "apexPredator",
      type: "onCritical",
      func: (data) => {
         return data.damage * data.attack.criticalDamage + 1 + getAnyJob("hunter").level.level * 4 * 0.01;
      },
      duration: 70,
      durationOnRefresh: 70,
   },
};
