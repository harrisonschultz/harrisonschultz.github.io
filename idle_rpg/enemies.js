export const enemies = {
  feeder: {
    prop: "feeder",
    label: "Feeder",
    description: "They want you to win, but they need to at least not be afk.",
    attrs: {
      agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
      int: { label: "Intelligence", level: 1, exp: 0, expNeeded: 0 },
      lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
      per: { label: "Perception", level: 1, exp: 0, expNeeded: 0 },
      str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
    },
    job: "feeder",

    jobs: {
      feeder: {
        attack: {
          speed: 10, // Speed in game ticks to attack again.
          criticalDamage: 1.5,
          dmgModifiers: [{ name: "int", modifier: 0.6 }],
          variance: 0.1, // gives attacks a range of damage by 10% either up or down.
        },
      },
    },

    stats: {
      health: { current: 12, max: 12 },
      stamina: { current: 1, max: 1 },
      mana: { current: 1, max: 1 },
    },
    reward: { exp: 0.3 },
  },

  toxicGamer: {
    prop: "toxicGamer",
    label: "Toxic Gamer",
    description: 'Colloquially known as "dumbass teammate", they do at least try harder than the feeder.',
    attrs: {
      agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
      int: { label: "Intelligence", level: 1, exp: 0, expNeeded: 0 },
      lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
      per: { label: "Perception", level: 1, exp: 0, expNeeded: 0 },
      str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
    },

    job: "toxicGamer",
    jobs: {
      toxicGamer: {
        attack: {
          speed: 16, // Speed in game ticks to attack again.
          criticalDamage: 2.0,
          dmgModifiers: [
            { name: "int", modifier: 0.5 },
            { name: "lck", modifier: 0.2 },
          ],
          variance: 0.1, // gives attacks a range of damage by 10% either up or down.
        },
      },
    },

    stats: {
      health: { current: 8, max: 8 },
      stamina: { current: 1, max: 1 },
      mana: { current: 1, max: 1 },
    },
    reward: { exp: 0.3 },
  },

  afkGamer: {
    prop: "afkGamer",
    label: "AFK Gamer",
    description: "This person has completed checked out.",
    attrs: {
      agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
      int: { label: "Intelligence", level: 1, exp: 0, expNeeded: 0 },
      lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
      per: { label: "Perception", level: 1, exp: 0, expNeeded: 0 },
      str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
    },

    job: "afkGamer",
    jobs: {
      afkGamer: {
        attack: {
          speed: 30, // Speed in game ticks to attack again.
          criticalDamage: 1.5,
          dmgModifiers: [{ name: "int", modifier: 0 }],
          variance: 0.1, // gives attacks a range of damage by 10% either up or down.
        },
      },
    },

    stats: {
      health: { current: 10, max: 10 },
      stamina: { current: 1, max: 1 },
      mana: { current: 1, max: 1 },
    },
    reward: { exp: 0.3 },
  },
};
