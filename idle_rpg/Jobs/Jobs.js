import {
   getJob,
   getJobs,
   setJob,
   getJobProgress,
   getStat,
   addJobExp,
   getAttr,
   addEffect,
   checkRequirements,
   getAnyJob,
   addAttrExp,
} from "../Character/Character.js";
import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from "../theme.js";
import { JobsDetails } from "../JobsDetails/JobsDetails.js";
import { Button } from "../components/Button/Button.js";
import { effects } from "../effects.js";

export class JobsList extends HTMLElement {
   constructor() {
      super();

      document.addEventListener("job-level", this.render);
   }

   async connectedCallback() {
      const res = await fetch("Jobs/Jobs.html");
      const textTemplate = await res.text();
      const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
      const shadowRoot = this.attachShadow({ mode: "open" });

      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      this.intialRender();
   }

   intialRender = () => {
      const tier1 = this.shadowRoot.getElementById("jobs-tier-1");
      const tier2 = this.shadowRoot.getElementById("jobs-tier-2");
      const tier3 = this.shadowRoot.getElementById("jobs-tier-3");
      const tier4 = this.shadowRoot.getElementById("jobs-tier-4");
      const jobTiers = [tier1, tier2, tier3, tier4];
      const charJobs = getJobs();
      for (const j in charJobs) {
         const job = charJobs[j];
         const jobDiv = document.createElement("div");
         const jobProgress = new JobsDetails(job, { withTree: true });

         jobDiv.id = `jobs-${j}`;
         jobDiv.className = "jobs-item";
         jobDiv.appendChild(jobProgress);
         jobTiers[job.tier - 1].appendChild(jobDiv);

         const button = new Button(
            job,
            "jobs",
            (jb) => {
               if (checkRequirements(jb)) {
                  setJob(jb.prop);
               }
            },
            "Select"
         );
         button.className += "jobs-select-button";
         jobDiv.appendChild(button);
      }
   };

   render = () => {};
}

customElements.define("jobs-list", JobsList);

export const jobs = {
   child: {
      label: "Child",
      prop: "child",
      description: "You are child with no specific strengths.",
      level: { level: 1, exp: 0, expNeeded: 1.1 },
      requirements: [],
      tier: 1,
      skillPoints: 0,
      skills: [
         {
            type: "onRest",
            label: "Pliable",
            key: "pliable",
            levelNeeded: 2,
            func: () => {
               addJobExp(0.001 * getAnyJob("child").level.level);
            },
            flavor: "A child's experience takes hold after rest",
            description: "Gain 0.001 exp per child level per rest tick.",
         },
         {
            type: "whenHit",
            label: "Learn By Example",
            key: "learnByExample",
            levelNeeded: 8,
            unlocked: true,
            func: (data) => {
               const { attack } = data;
               for (const attr of attack.dmgModifiers) {
                  addAttrExp(attr.name, attr.modifier * (0.01 * getAnyJob("child").level.level));
               }
            },
            attack: {
               speed: 15,
               criticalDamage: 1.5,
               dmgModifiers: [
                  { name: "str", modifier: 0.3 },
                  { name: "agi", modifier: 0.3 },
               ],
               variance: 0.1, // gives attacks a range of damage by 10% either up or down.
            },
            flavor: "Learning from the experience gives new insights",
            description:
               "Gain experience when hit by an enemy based on their attack stats (enemy attack attribute * 1/10 of your child level).",
         },
      ],
      attack: {
         speed: 15,
         criticalDamage: 1.5,
         dmgModifiers: [
            { name: "str", modifier: 0.3 },
            { name: "agi", modifier: 0.3 },
         ],
         variance: 0.1, // gives attacks a range of damage by 10% either up or down.
      },
   },

   urchin: {
      label: "Urchin",
      prop: "urchin",
      description: "As an urchin you have fend for yourself. Your strength and speed will be your only allies.",
      level: { level: 1, exp: 0, expNeeded: 1.1 },
      requirements: [
         { type: "job", name: "child", level: 10 },
         { type: "attribute", name: "str", level: 10 },
         { type: "attribute", name: "agi", level: 10 },
      ],
      skills: [
         {
            type: "onDodge",
            label: "Opportunistic",
            key: "opportunistic",
            levelNeeded: 5,
            unlocked: true,
            func: (data) => {
               // Multiply duration by level
               const oppurtunistic = { ...effects.opportunistic };
               oppurtunistic.duration = oppurtunistic.duration + getAnyJob("urchin").level.level;
               addEffect(oppurtunistic);
            },
            flavor: "An opponent is never more vulnerable than when he puts himself off balance.",
            description: "After a successful dodge, 100% critical chance for the next 2.5s + (0.1s per urchin level)",
         },
         {
            type: "attack",
            label: "Swift Slash",
            key: "swiftSlash",
            levelNeeded: 3,
            cost: [{ type: "stat", name: "stamina", value: -4 }],
            cooldown: 100,
            func: ({ damage, attack, attacker, defender }) => {
               return {
                  secondaryAttributes: [
                     {
                        name: "criticalChance",
                        value: 30 + getAnyJob("urchin").level.level,
                     },
                  ],
               };
            },
            attack: {
               criticalDamage: 2.2,
               dmgModifiers: [
                  { name: "str", modifier: 0.35 },
                  { name: "agi", modifier: 0.45 },
               ],
               variance: 0.1, // gives attacks a range of damage by 10% either up or down.
            },
            flavor: "A swift blade can inflict greater wounds than the mightiest hammer.",
            description:
               "An attack with bonus 30% + (1% per urchin level) critical chance, and a 220% critical damage multiplier",
         },
      ],
      tier: 2,
      attack: {
         speed: 15,
         criticalDamage: 1.5,
         dmgModifiers: [
            { name: "str", modifier: 0.35 },
            { name: "agi", modifier: 0.45 },
         ],
         variance: 0.1, // gives attacks a range of damage by 10% either up or down.
      },
   },

   student: {
      label: "Student",
      prop: "student",
      description: "A student of the world, a young mind to be molded.",
      level: { level: 1, exp: 0, expNeeded: 1.1 },
      requirements: [
         { type: "job", name: "child", level: 10 },
         { type: "attribute", name: "int", level: 13 },
      ],
      skillPoints: 0,
      skills: [
         {
            type: "onKill",
            label: "Observant",
            key: "observant",
            levelNeeded: 4,
            unlocked: true,
            func: (enemy) => {
               const percentageExpBonus = (getAttr("int").level / 1 / getAnyJob("student").level.level) * 0.5;
               const percent = enemy.reward.exp * percentageExpBonus;

               addJobExp(percent);
            },
            flavor: "A blow to the body, is a trove to the mind.",
            description:
               "Gain percentage bonus class exp on kill. Enemy Exp + (Enemy Exp * intelligence / 1 / student level * 0.5)",
         },
         {
            type: "attack",
            label: "Flame Lash",
            key: "flameLash",
            levelNeeded: 6,
            cost: [{ type: "stat", name: "mana", value: -4 }],
            cooldown: 100,
            unlocked: true,
            func: ({ damage, attack, attacker, defender }) => {
               addEffect(effects.flameLash, defender);
            },
            attack: {
               criticalDamage: 1.8,
               dmgModifiers: [{ name: "int", modifier: 1.5 }],
               variance: 0.15, // gives attacks a range of damage by 10% either up or down.
            },
            flavor: "Strikes in an instance, but the scars never fade.",
            description:
               "A whip of searing heat strikes your foe dealing 1.5x of your intelligence and applying a burning debuff that deals (student level / 2)% damage per second",
         },
      ],
      tier: 2,
      attack: {
         speed: 20,
         criticalDamage: 1.8,
         dmgModifiers: [{ name: "int", modifier: 1 }],
         variance: 0.15, // gives attacks a range of damage by 10% either up or down.
      },
   },

   hunter: {
      label: "Hunter",
      prop: "hunter",
      description: "A student of the world, a young mind to be molded.",
      level: { level: 1, exp: 0, expNeeded: 1.1 },
      requirements: [
         { type: "job", name: "urchin", level: 12 },
         { type: "attribute", name: "agi", level: 25 },
         { type: "attribute", name: "per", level: 25 },
      ],
      skillPoints: 0,
      skills: [
         {
            type: "onAttack",
            label: "Thrill of the hunt",
            key: "thrillOfTheHunt",
            levelNeeded: 7,
            func: ({ damage, attack, attacker, defender }) => {
               const stat = getStat("health", defender);

               let newDamage = damage;
               if (stat.current <= stat.max / 2) {
                  newDamage = damage * (1.25 + 0.01 * getAnyJob("hunter").level.level);
               }

               return { damage: newDamage };
            },
            flavor: "With every drop of blood, the kill inches closer.",
            description: "Gain 25% + (1% per class level) bonus damage to enemies below 50% health",
         },
         {
            type: "onKill",
            label: "Apex Predator",
            key: "apexPredator",
            levelNeeded: 10,
            func: () => {
               const apexPredator = { ...effects.apexPredator };
               addEffect(apexPredator);
            },
            flavor: "placeholder",
            description: "Increases critical damage multiplier by 100% + (4x class level) on kill",
         },
      ],
      tier: 3,
      attack: {
         speed: 22,
         criticalDamage: 1.8,
         dmgModifiers: [
            { name: "agi", modifier: 0.45 },
            { name: "per", modifier: 0.4 },
         ],
         variance: 0.1, // gives attacks a range of damage by 10% either up or down.
      },
   },
};
