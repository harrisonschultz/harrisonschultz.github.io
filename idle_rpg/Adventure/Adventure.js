import {
  setAction,
  getAttr,
  setAvailableActions,
  getAdventure,
  getAdventureProgress,
  setAdventure,
} from "../Character/Character.js";
import { Button } from "../components/Button/Button.js";
import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from "../theme.js";
import { enemies } from "../enemies.js";
import { adventures } from "../adventures.js";

export class Adventure extends HTMLElement {
  constructor() {
    super();
    this.buttonsCreated = [];
  }

  async connectedCallback() {
    const res = await fetch("./Adventure/Adventure.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    document.addEventListener("attr-level", this.renderActions);
    document.addEventListener("adventure-changed", this.renderAdventureProgressBar);
    this.initialRender();
  }

  initialRender = () => {
    this.renderActions(true);
    this.render();
  };

  renderAdventureProgressBar = () => {
    if (getAdventure()) {
      const progressContainer = this.shadowRoot.getElementById("current-adventure-progress");

      // Remove previous progress bar
      if (progressContainer.firstChild) {
        progressContainer.removeChild(progressContainer.firstChild)
      }

      const progressBar = new ProgressBar("adventure-progress", getAdventureProgress, theme.colors.pastelPaleGreen, {
        label: getAdventure().label,
        value: true,
        duration: 0.8,
      });
      progressContainer.appendChild(progressBar);
    }
  };

  renderActions = (skip = false) => {
    if (skip || checkNewAvailableActions()) {
      for (const act in adventures) {
        if (
          (!adventures[act].conditions || areConditionsMet(adventures[act].conditions)) &&
          !this.buttonsCreated.includes(act)
        ) {
          const button = new Button(adventures[act], "adventure", (act) => startAdventure(act));

          const row = this.shadowRoot.getElementById(`adventure-tier-${adventures[act].tier}`);
          row.appendChild(button);

          const seperator = document.createElement("div");
          row.appendChild(seperator);
          seperator.className = "button-seperator";
          this.buttonsCreated.push(act);
        }
      }
    }
  };

  render = () => {};
}

customElements.define("adventure-list", Adventure);

export function startAdventure(adv) {
  setAction("adventure");
  setAdventure(adv);
}

export function getNextEnemy(adventure) {
  // Check for boss.
  if (adventure.progress.current >= adventure.progress.max) {
    return enemies[adventure.boss[0]]
  } else {
    return getRandomEnemy(adventure)
  }

}


export function getRandomEnemy(adventure) {
  const rand = Math.floor(Math.random() * adventure.enemies.length);
  const enemy = enemies[adventure.enemies[rand]]
  
  // Refresh
  enemy.stats.health.current = enemy.stats.health.max

  return enemy;
}

function checkNewAvailableActions() {
  const available = [];

  const isDifferent = false;

  for (const act of adventure) {
    if (act.conditions) {
      const met = areConditionsMet(act.conditions);
      available.push(met);

      const lastIndex = available.length - 1;
      isDifferent = !availableActions[lastIndex] || available[lastIndex] !== availableActions[lastIndex];
    }
  }
  setAvailableActions(available);
  return isDifferent;
}

export function isAdventureCompleted(adventure) {
  return window.player.completedAdventures.includes(adventure)
}

export function areConditionsMet(conditions) {
  for (const s of conditions) {
    if (s.type === 'attr') {
      if (getAttr(s.name).level < s.value) {
        return false;
      }
    } else if (s.type === 'adventure') {
      if (!isAdventureCompleted(s.name)) {
        return false;
      }
    }
   
  }

  return true;
}
