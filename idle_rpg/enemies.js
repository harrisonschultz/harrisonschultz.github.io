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
      effects: [],
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
         health: { current: 22, max: 22 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.3 },
   },

   toxicGamer: {
      prop: "toxicGamer",
      label: "Toxic Gamer",
      description: 'Colloquially known as "dumbass teammate", they do at least try harder than the feeder.',
      effects: [],
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
         health: { current: 18, max: 18 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.3 },
   },

   afkGamer: {
      prop: "afkGamer",
      label: "AFK Gamer",
      description: "This person has completed checked out.",
      effects: [],
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
         health: { current: 32, max: 32 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.9 },
   },

   smurf: {
      prop: "smurf",
      label: "Smurf",
      description: "This person has completed checked out.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 3, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 2, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
      },

      job: "smurf",
      jobs: {
         smurf: {
            attack: {
               speed: 29, // Speed in game ticks to attack again.
               criticalDamage: 2.5,
               dmgModifiers: [
                  { name: "int", modifier: 2 },
                  { name: "per", modifier: 1 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 64, max: 64 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.3 },
   },
};
