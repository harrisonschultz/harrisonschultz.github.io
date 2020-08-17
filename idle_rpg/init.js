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
      prop: 'child',
      label: 'Child',
      description: 'You are child with no specific strengths.',
      level: { level: 1, exp: 0, expNeeded: 0  },
      tier: 1,
      attack: {
        speed: 10,
        criticalDamage: 1.5,
        dmgModifiers: [{name: 'str', modifier: 0.5}, {name: 'agi', modifier: 0.5}],
        variance: 0.1 // gives attacks a range of damage by 10% either up or down.
      }
    },

    adventure: undefined,
    adventures: [],

    stats: {
      health: { current: 1, max: 1 },
      stamina: { current: 1, max: 1 },
      mana: { current: 1, max: 1 },
      fatigue: { current: 10, max: 10 },
    },
  };
}
