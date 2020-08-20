import {
   getJob,
   getJobs,
   setJob,
   getJobProgress,
   addJobExp,
   getAttr,
   addEffect,
   checkRequirements,
} from "../Character/Character.js";
import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from "../theme.js";
import { JobsDetails } from "../JobsDetails/JobsDetails.js";
import { Button } from "../components/Button/Button.js";
import { effects } from '../effects.js'

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

      for (const j in getJobs()) {
         const job = jobs[j];
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
      level: { level: 10, exp: 0, expNeeded: 1.1 },
      requirements: [],
      tier: 1,
      skillPoints: 1,
      skills: [
         {
            type: "onRest",
            label: "Pliable",
            key: "pliable",
            cost: 1,
            unlocked: true,
            func: () => {
               addJobExp(getJob().level.expNeeded * 0.001 + 0.003);
            },
            flavor: "A child's experience takes hold after rest",
            description: "Gain 0.1% of your exp to level per rest tick.",
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
      requirements: [{ type: "job", name: "child", level: 10 }],
      skillPoints: 2,
      skills: [
        {
          type: "onDodge",
          label: "Opportunistic",
          key: "opportunistic",
          cost: 1,
          unlocked: true,
          func: (data) => {
            addEffect(effects.oppurtunistic)
          },
          flavor: "An opponent is never more vulnerable than when he puts himself off balance.",
          description: "After a successful dodge, 100% critical chance for the next 2.5s",
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
      requirements: [{ type: "job", name: "child", level: 10 }],
      skillPoints: 0,
      skills: [
         {
            type: "onKill",
            label: "Observant",
            key: "observant",
            cost: 2,
            unlocked: true,
            func: (enemy) => {
               // Base exp bonus, and a percentage
               const baseExpBonus = 0.1;
               const percentageExpBonus = (getAttr("int").level / 4) * 0.01; // boost exp by 1/4% of you intellegence
               const base = enemy.reward.exp * baseExpBonus;
               const percent = enemy.reward.exp * percentageExpBonus;

               console.log(`Gained ${enemy.reward.exp} + ${base + percent}`);

               addJobExp(base + percent);
            },
            flavor: "A blow to the body, is a trove to the mind.",
            description: "Gain 1/4 of your intelligence as a percentage class exp bonus on kill.",
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
};
