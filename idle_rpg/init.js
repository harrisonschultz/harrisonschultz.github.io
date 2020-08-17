export function initialize() {
  window.player = {
    prevAction: "rest",
    action: "rest",

    tab: "Train",

    attrs: {
      agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
      int: { label: "Intelligence", level: 1, exp: 0, expNeeded: 0 },
      lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
      per: { label: "Perception", level: 1, exp: 0, expNeeded: 0 },
      str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
    },

    job: {
      job: "child",
      level: { level: 1, exp: 0, expNeeded: 0 },
    },

    stats: {
      health: { current: 1, max: 1 },
      stamina: { current: 1, max: 1 },
      mana: { current: 1, max: 1 },
      fatigue: { current: 10, max: 10 },
    },
  };
}
