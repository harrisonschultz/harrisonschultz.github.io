import { jobs } from "./Jobs/Jobs.js"

export function initialize() {
  window.player = {
    prevAction: "rest",
    action: "rest",

    tab: "Train",

    attrs: {
      agi: { label: "Agility", level: 1, exp: 0, expNeeded: 1.1 },
      int: { label: "Intelligence", level: 1, exp: 0, expNeeded: 1.1 },
      lck: { label: "Luck", level: 1, exp: 0, expNeeded: 1.1 },
      per: { label: "Perception", level: 1, exp: 0, expNeeded: 1.1 },
      str: { label: "Strength", level: 100, exp: 0, expNeeded: 1.1 },
    },

    job: 'child',

    jobs: jobs,

    adventure: undefined,
    adventures: [],
    effects: [],
    skills: [],
    skillsUnlocked: [],

    stats: {
      health: { current: 1, max: 1 },
      stamina: { current: 1, max: 1 },
      mana: { current: 1, max: 1 },
      fatigue: { current: 10, max: 10 },
    },
  };
}
