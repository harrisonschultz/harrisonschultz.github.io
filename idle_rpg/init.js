export function initialize() {
  window.player = {
    prevAction: 'rest',
    action: 'rest',

    attrs: {
      agi: { level: 1, exp: 0, expNeeded: 0 },
      int: { level: 1, exp: 0, expNeeded: 0 },
      lck: { level: 1, exp: 0, expNeeded: 0 },
      per: { level: 1, exp: 0, expNeeded: 0 },
      str: { level: 1, exp: 0, expNeeded: 0 },
    },

    level: {
      level: 1,
      experience: 0,
    },

    stats: {
      health: { current: 1, max: 1 },
      stamina: { current: 10, max: 10 },
      mana: { current: 1, max: 1 },
      fatigue: { current: 10, max: 10},
    },
  };
}
