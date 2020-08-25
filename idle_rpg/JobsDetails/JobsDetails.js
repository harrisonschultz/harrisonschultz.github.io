import {
   getJob,
   getJobProgress,
   isSkillEquipped,
   isSkillUnlocked,
   unequipSkill,
   equipSkill,
   getAnyJob,
   checkRequirements,
} from "../Character/Character.js";
import { getAttackDamageRange } from "../Combat/Combat.js";
import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from "../theme.js";
import { jobs } from "../Jobs/Jobs.js";
import { Button } from "../components/Button/Button.js";

export class JobsDetails extends HTMLElement {
   constructor(job, options) {
      super();

      this.job = job || getJob();
      this.options = options;

      document.addEventListener("job-changed", this.render);
      document.addEventListener("job-level", this.render);
      document.addEventListener("skill-unlocked", this.renderSkills);
      document.addEventListener("skill-equipped", this.renderSkills);
      document.addEventListener("attr-level", this.render);
   }

   async connectedCallback() {
      const res = await fetch("JobsDetails/JobsDetails.html");
      const textTemplate = await res.text();
      const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
      const shadowRoot = this.attachShadow({ mode: "open" });

      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      this.intialRender();
   }

   intialRender = () => {
      const attrBar = new ProgressBar(
         "job-progress",
         () => getJobProgress(window.player, this.job.prop),
         theme.colors.pastelYellow,
         { value: true, resetOnOverflow: true },
         { height: "4px" }
      );

      this.shadowRoot.getElementById(`jobs-bar`).appendChild(attrBar);
      attrBar.className = "bar";

      if (this.options && this.options.withTree) {
         // Job skills panel
         const skillTree = this.shadowRoot.getElementById("job-skill-tree");
         const title = document.createElement("div");
         title.innerHTML = "Skills";
         title.className = "req-title";
         skillTree.appendChild(title);

         for (const skill of this.job.skills) {
            const skillDiv = document.createElement("div");
            const skillAction = document.createElement("div");
            const skillInfo = document.createElement("div");
            const skillLabel = document.createElement("div");
            const skillDescription = document.createElement("div");
            const skillFlavor = document.createElement("div");
            const skillCost = document.createElement("div");
            const tooltip = document.createElement("div");

            tooltip.id = `skill-tooltip-${skill.key}`;
            tooltip.className = "skill-tooltip";

            skillAction.className = "skill-action-container";
            skillAction.id = `skill-action-${skill.key}`;
            skillDiv.className = "skill-container";
            skillDiv.id = `skills-${skill.key}`;

            skillInfo.className = "skill-info";
            skillInfo.id = `skill-info-${skill.key}`;
            skillInfo.onmouseenter = () => {
               const tt = this.shadowRoot.getElementById(`skill-tooltip-${skill.key}`);
               tt.style.display = "flex";
               tt.style.opacity = 1;
               tt.animate(
                  [
                     { opacity: "0%", display: "none" },
                     { opacity: "1%", display: "flex" },
                     { opacity: "100%", display: "flex" },
                  ],
                  { duration: 1, easing: "linear" }
               );
               this.shadowRoot.getElementById(`skills-${skill.key}`).className += " skill-selected";
            };

            skillInfo.onmouseleave = () => {
               const tt = this.shadowRoot.getElementById(`skill-tooltip-${skill.key}`);
               tt.style.display = "none";
               tt.style.opacity = 0;

               this.shadowRoot.getElementById(`skills-${skill.key}`).className = "skill-container";
            };

            skillLabel.className = "skill-label";
            skillLabel.innerHTML = skill.label;

            skillDescription.className = "skill-description";
            skillDescription.innerHTML = skill.description;

            skillCost.className = "skill-cost";
            const skillLockIcon = document.createElement("span");
            const skillLockText = document.createElement("span");
            if (!isSkillUnlocked(skill, this.job)) {
               skillLockIcon.className = "lock-icon mdi mdi-lock";
               skillLockIcon.style.color = theme.colors.pastelRed;
               skillLockText.innerHTML = `${skill.levelNeeded}`;
            }
            skillCost.appendChild(skillLockIcon);
            skillCost.appendChild(skillLockText);
            skillFlavor.className = "skill-flavor";
            skillFlavor.innerHTML = `"${skill.flavor}"`;

            skillDiv.appendChild(skillInfo);
            skillInfo.appendChild(skillLabel);
            skillInfo.appendChild(skillCost);
            tooltip.appendChild(skillFlavor);
            tooltip.appendChild(skillDescription);
            skillInfo.appendChild(tooltip);

            if (isSkillEquipped(skill)) {
               skillDiv.className += "skill-equipped";

               // Add unequip option
               const button = new Button(skill, "skills", (skl) => unequipSkill(skl), "Unequip");
               skillAction.title = "Unequip";
               skillAction.appendChild(button);
            } else if (isSkillUnlocked(skill, this.job)) {
               skillDiv.className += "skill-unlocked";

               // Add equip option
               const button = new Button(skill, "skills", (skl) => equipSkill(skl), "Equip");
               skillAction.title = "Equip";
               skillAction.appendChild(button);
            }

            tooltip.append(skillAction);
            skillTree.appendChild(skillDiv);
         }
      }

      if (!checkRequirements(this.job)) {
         const labelDiv = document.createElement("div");
         const jobReqDiv = document.createElement("div");
         const attrReqDiv = document.createElement("div");
         const jobReqLabel = document.createElement("div");
         const attrReqLabel = document.createElement("div");

         const reqContainer = this.shadowRoot.getElementById("job-skill-points");
         reqContainer.className += " req-container";
         labelDiv.className = "req-title";
         labelDiv.innerHTML = "Requirements";

         jobReqDiv.className = "req-div";
         attrReqDiv.className = "req-div";

         jobReqLabel.innerHTML = "Job";
         attrReqLabel.innerHTML = "Attributes";

         jobReqLabel.className = "req-sub-title";
         attrReqLabel.className = "req-sub-title";

         jobReqDiv.appendChild(jobReqLabel);
         attrReqDiv.appendChild(attrReqLabel);

         for (const req of this.job.requirements) {
            const reqdiv = document.createElement("div");
            const reqLabel = document.createElement("div");
            const reqValue = document.createElement("div");

            reqdiv.className = "req-row";
            reqValue.className = "req-value";

            reqLabel.innerHTML = `${req.name.substring(0, 1).toUpperCase()}${req.name.substring(1)}`;
            reqValue.innerHTML = req.level;

            reqdiv.appendChild(reqLabel);
            reqdiv.appendChild(reqValue);
            switch (req.type) {
               case "job":
                  jobReqDiv.appendChild(reqdiv);
                  break;
               case "attribute":
                  attrReqDiv.appendChild(reqdiv);
                  break;
            }
         }

         reqContainer.appendChild(labelDiv);
         if (jobReqDiv.childElementCount > 1) {
            reqContainer.appendChild(jobReqDiv);
         }
         if (attrReqDiv.childElementCount > 1) {
            reqContainer.appendChild(attrReqDiv);
         }
      }

      this.render();
   };

   renderSkills = () => {
      if (this.options && this.options.withTree) {
         // Job skills panel
         for (const skill of this.job.skills) {
            const skillDiv = this.shadowRoot.getElementById(`skills-${skill.key}`);

            skillDiv.className = "skill-container";
            if (isSkillEquipped(skill)) {
               skillDiv.className += "skill-equipped";
               // Remove and add new Button if it should be changed.
               const skillAction = this.shadowRoot.getElementById(`skill-action-${skill.key}`);
               if (skillAction.title !== "Unequip") {
                  skillAction.title = "Unequip";
                  skillAction.removeChild(skillAction.firstChild);
                  // Add unequip option
                  const button = new Button(skill, "skills", (skl) => unequipSkill(skl), "Unequip");
                  skillAction.appendChild(button);
               }
            } else if (isSkillUnlocked(skill, this.job)) {
               skillDiv.className += "skill-unlocked";
               // Remove and add new Button if it should be changed.
               const skillAction = this.shadowRoot.getElementById(`skill-action-${skill.key}`);
               if (skillAction.title !== "Equip") {
                  skillAction.title = "Equip";
                  skillAction.removeChild(skillAction.firstChild);
                  console.log(skill.key, "adding equip");
                  // Add equip option
                  const button = new Button(skill, "skills", (skl) => equipSkill(skl), "Equip");
                  skillAction.appendChild(button);
               }
            }
         }
      }
   };

   render = () => {
      if (this.options && this.options.self) {
         this.job = getJob();
      }

      if (this.shadowRoot) {
         this.shadowRoot.getElementById("jobs-label").innerHTML = this.job.label;
         this.shadowRoot.getElementById("jobs-value").innerHTML = `${this.job.level.level}`;

         // Add job stats
         const dmg = this.shadowRoot.getElementById("job-attack-damage-value");
         const attackSpeed = this.shadowRoot.getElementById("job-attack-speed-value");
         const critDmg = this.shadowRoot.getElementById("job-crit-damage-value");

         const damageRange = getAttackDamageRange(this.job);
         dmg.innerHTML = `${damageRange.min} - ${damageRange.max}`;
         attackSpeed.innerHTML = `${this.job.attack.speed / 10}s`;
         critDmg.innerHTML = `${this.job.attack.criticalDamage * 100}%`;
      }
   };
}

customElements.define("jobs-details", JobsDetails);
