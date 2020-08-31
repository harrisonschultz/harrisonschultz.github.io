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
               speed: 20, // Speed in game ticks to attack again.
               criticalDamage: 1.5,
               dmgModifiers: [{ name: "int", modifier: 0.6 }],
               variance: 0.1, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 8, max: 8 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.22 },
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
               speed: 22, // Speed in game ticks to attack again.
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
         health: { current: 11, max: 11 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.22 },
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
         health: { current: 20, max: 20 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.19 },
   },

   smurf: {
      prop: "smurf",
      label: "Smurf",
      description: "This person has completed checked out.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 8, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 5, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
      },

      job: "smurf",
      jobs: {
         smurf: {
            attack: {
               speed: 29, // Speed in game ticks to attack again.
               criticalDamage: 2.5,
               dmgModifiers: [
                  { name: "int", modifier: 0.4 },
                  { name: "per", modifier: 0.3 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 30, max: 30 },
         stamina: { current: 1, max: 1 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.35 },
   },

   curatedArt: {
      prop: "curatedArt",
      label: "Finely Curated Art",
      description: "Art that has been aged like a fine wine.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 8, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 13, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
      },

      job: "curatedArt",
      jobs: {
         curatedArt: {
            attack: {
               speed: 20, // Speed in game ticks to attack again.
               criticalDamage: 1.8,
               dmgModifiers: [
                  { name: "int", modifier: 0.25 },
                  { name: "per", modifier: 0.45 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 38, max: 38 },
         stamina: { current: 1, max: 1 },
         mana: { current: 10, max: 10 },
      },
      reward: { exp: 0.3 },
   },

   displayCase: {
      prop: "displayCase",
      label: "Display Case",
      description: "A display case showing some artifact",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 1, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 15, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 5, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 18, exp: 0, expNeeded: 0 },
      },

      job: "displayCase",
      jobs: {
         displayCase: {
            attack: {
               speed: 32, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [{ name: "str", modifier: 0.7 }],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 40, max: 40 },
         stamina: { current: 10, max: 10 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.32 },
   },

   interactiveExhibit: {
      prop: "interactiveExhibit",
      label: "Interactive Exhibit",
      description: "History with all the stimuli",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 10, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 10, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 10, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 1, exp: 0, expNeeded: 0 },
      },

      job: "interactiveExhibit",
      jobs: {
         interactiveExhibit: {
            attack: {
               speed: 22, // Speed in game ticks to attack again.
               criticalDamage: 2.0,
               dmgModifiers: [
                  { name: "agi", modifier: 0.33 },
                  { name: "int", modifier: 0.3 },
                  { name: "per", modifier: 0.33 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 34, max: 34 },
         stamina: { current: 10, max: 10 },
         mana: { current: 10, max: 10 },
      },
      reward: { exp: 0.35 },
   },

   chunks: {
      prop: "chunks",
      label: "Chunks",
      description: "The master curator's cat, impregnable and steadfast",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 20, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 10, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 10, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 18, exp: 0, expNeeded: 0 },
      },

      job: "chunks",
      jobs: {
         chunks: {
            attack: {
               speed: 25, // Speed in game ticks to attack again.
               criticalDamage: 2.1,
               dmgModifiers: [
                  { name: "agi", modifier: 0.4 },
                  { name: "int", modifier: 0.3 },
                  { name: "str", modifier: 0.4 },
                  { name: "per", modifier: 0.3 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 75, max: 75 },
         stamina: { current: 22, max: 22 },
         mana: { current: 8, max: 8 },
      },
      reward: { exp: 0.8 },
   },

   workerAnt: {
      prop: "workerAnt",
      label: "Worker Ant",
      description: "The lowest of the communist community",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 40, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 1, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 1, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 40, exp: 0, expNeeded: 0 },
      },

      job: "workerAnt",
      jobs: {
         workerAnt: {
            attack: {
               speed: 2, // Speed in game ticks to attack again.
               criticalDamage: 1.5,
               dmgModifiers: [
                  { name: "agi", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 100, max: 100 },
         stamina: { current: 22, max: 22 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.8 },
   },

   soldierAnt: {
      prop: "soldierAnt",
      label: "Soldier Ant",
      description: "Keeps everyone's ass in line, and yours is no exception.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 50, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 20, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 15, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 50, exp: 0, expNeeded: 0 },
      },
      job: "soldierAnt",
      jobs: {
         soldierAnt: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "agi", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 120, max: 120 },
         stamina: { current: 22, max: 22 },
         mana: { current: 1, max: 1 },
      },
      reward: { exp: 0.8 },
   },

   queenAnt: {
      prop: "queenAnt",
      label: "Queen Ant",
      description: "The Xi Jinping of ants",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 30, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 100, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 100, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 30, exp: 0, expNeeded: 0 },
      },

      job: "queenAnt",
      jobs: {
         queenAnt: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 240, max: 240 },
         stamina: { current: 12, max: 12 },
         mana: { current: 32, max: 32 },
      },
      reward: { exp: 1.6 },
   },


   hayden: {
      prop: "hayden",
      label: "Hayden The Scholar",
      description: "Learned, Accomplished, Prestigious.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 40, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 200, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 150, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 30, exp: 0, expNeeded: 0 },
      },

      job: "hayden",
      jobs: {
         hayden: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 300, max: 300 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   jake: {
      prop: "jake",
      label: "Jake The Muscle",
      description: "Invincible, Vigourous, Hardened",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 200, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 30, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 80, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 220, exp: 0, expNeeded: 0 },
      },

      job: "jake",
      jobs: {
         jake: {
            attack: {
               speed: 32, // Speed in game ticks to attack again.
               criticalDamage: 2.4,
               dmgModifiers: [
                  { name: "agi", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 380, max: 380 },
         stamina: { current: 42, max: 42 },
         mana: { current: 20, max: 20 },
      },
      reward: { exp: 1.6 },
   },

   zach: {
      prop: "zach",
      label: "Zach The Leader",
      description: "Charismatic, Handsome, Reliable.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 40, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 170, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 130, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 30, exp: 0, expNeeded: 0 },
      },

      job: "zach",
      jobs: {
         zach: {
            attack: {
               speed: 22, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 320, max: 320 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   Joe: {
      prop: "Joe",
      label: "Joe The Enforcer",
      description: "Strong, Blunt, In your face.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 170, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 30, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 80, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 170, exp: 0, expNeeded: 0 },
      },

      job: "joe",
      jobs: {
         joe: {
            attack: {
               speed: 25, // Speed in game ticks to attack again.
               criticalDamage: 2.4,
               dmgModifiers: [
                  { name: "agi", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 340, max: 340 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   daniel: {
      prop: "daniel",
      label: "Daniel The Hero",
      description: "Strong-willed, Brave, Enduring",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 70, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 200, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 60, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 270, exp: 0, expNeeded: 0 },
      },

      job: "daniel",
      jobs: {
         daniel: {
            attack: {
               speed: 35, // Speed in game ticks to attack again.
               criticalDamage: 2.5,
               dmgModifiers: [
                  { name: "int", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
               ],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 410, max: 410 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   mike: {
      prop: "mike",
      label: "Mike The Fixer",
      description: "Efficient, Quick, Clean",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 60, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 80, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 10, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 100, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 100, exp: 0, expNeeded: 0 },
      },

      job: "mike",
      jobs: {
         mike: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "agi", modifier: 0.4 },
                  { name: "lck", modifier: 0.6 },
                  { name: "str", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 330, max: 330 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   brandon: {
      prop: "brandon",
      label: "Brandon The Scholar",
      description: "Learned, Accomplished, Prestigious.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 40, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 170, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 130, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 30, exp: 0, expNeeded: 0 },
      },

      job: "brandon",
      jobs: {
         brandon: {
            attack: {
               speed: 23, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
               ],
               variance: 0.1, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 310, max: 310 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   tony: {
      prop: "tony",
      label: "Tony The Marksmen",
      description: "Precise, Accurate, Stealthy",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 120, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 80, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 130, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 130, exp: 0, expNeeded: 0 },
      },

      job: "tony",
      jobs: {
         tony: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "agi", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 320, max: 320 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   nick: {
      prop: "nick",
      label: "Nick The Ghost",
      description: "Subtle, Masterful, Deft",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 120, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 80, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 130, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 130, exp: 0, expNeeded: 0 },
      },

      job: "nick",
      jobs: {
         nick: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "agi", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 300, max: 300 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   otherZach: {
      prop: "otherZach",
      label: "Other Zach The Any Man",
      description: "Adaptive, Charismatic, Agile",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 120, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 80, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 130, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 130, exp: 0, expNeeded: 0 },
      },

      job: "otherZach",
      jobs: {
         otherZach: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "agi", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
               ],
               variance: 0.08, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 350, max: 350 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   kenny: {
      prop: "kenny",
      label: "Kenny The Mastermind",
      description: "Omniscient, Authoritative, Devious",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 60, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level: 350, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 1, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level: 350, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 60, exp: 0, expNeeded: 0 },
      },

      job: "kenny",
      jobs: {
         kenny: {
            attack: {
               speed: 28, // Speed in game ticks to attack again.
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
               ],
               variance: 0.1, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 700, max: 700 },
         stamina: { current: 12, max: 12 },
         mana: { current: 52, max: 52 },
      },
      reward: { exp: 1.6 },
   },

   spirg: {
      prop: "spirg",
      label: "Spirg",
      description: "Lord of chaos, and entropy.",
      effects: [],
      attrs: {
         agi: { label: "Agility", level: 400, exp: 0, expNeeded: 0 },
         int: { label: "Intelligence", level:  400, exp: 0, expNeeded: 0 },
         lck: { label: "Luck", level: 15, exp: 0, expNeeded: 0 },
         per: { label: "Perception", level:  400, exp: 0, expNeeded: 0 },
         str: { label: "Strength", level: 400, exp: 0, expNeeded: 0 },
      },

      job: "spirg",
      jobs: {
         spirg: {
            attack: {
               speed: 40, // Speed in game ticks to attack again.
               criticalDamage: 2.8,
               dmgModifiers: [
                  { name: "per", modifier: 0.4 },
                  { name: "int", modifier: 0.4 },
                  { name: "str", modifier: 0.4 },
                  { name: "agi", modifier: 0.4 },
               ],
               variance: 0.25, // gives attacks a range of damage by 10% either up or down.
            },
         },
      },

      stats: {
         health: { current: 10000, max: 10000 },
         stamina: { current: 200, max: 200 },
         mana: { current: 200, max: 200 },
      },
      reward: { exp: 3.0 },
   },
};
