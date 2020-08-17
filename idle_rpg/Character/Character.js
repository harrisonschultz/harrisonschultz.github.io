import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from "../theme.js";

const STR_HEALTH_MODIFIER = 1;
const INT_MANA_MODIFIER = 1;
const AGI_STAMINA_MODIFIER = 1;

(async () => {
  const res = await fetch("./Character/Character.html");
  const textTemplate = await res.text();
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

  class Character extends HTMLElement {
    constructor() {
      super();

      if (window.player) {
        this.attrs = window.player.attrs;
        this.level = window.player.level;
        this.stats = window.player.stats;
      }

      document.addEventListener("attr-level", () => this.setMaxStat("health", "str", STR_HEALTH_MODIFIER));
      document.addEventListener("attr-level", () => this.setMaxStat("mana", "int", INT_MANA_MODIFIER));
      document.addEventListener("attr-level", () => this.setMaxStat("stamina", "agi", AGI_STAMINA_MODIFIER));
      document.addEventListener("character-changed", this.render);
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: "open" });

      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      this.initialRender();
    }

    initialRender = () => {
      // Create the progress bars.
      const statsColors = {
        health: theme.colors.pastelRed,
        mana: theme.colors.pastelBlue,
        stamina: theme.colors.pastelPaleGreen,
        fatigue: theme.colors.pastelPurple,
      };

      // Stat bars
      for (const s in window.player.stats) {
        const statBar = new ProgressBar("character-changed", () => getStat(s), statsColors[s], {
          label: s,
          value: true,
        });
        this.shadowRoot.getElementById(`${s}-bar`).appendChild(statBar);
        statBar.className = "bar";
      }

      // Attribute bars
      const attrContainer = this.shadowRoot.getElementById("attributes-container");
      for (const s in window.player.attrs) {
        const attr = window.player.attrs[s];
        const attrRow = document.createElement("div");
        const detailDiv = document.createElement("div");
        const labelDiv = document.createElement("div");
        const valueDiv = document.createElement("div");
        const barDiv = document.createElement("div");

        attrRow.className = "attribute";
        detailDiv.className = "attribute-details";
        labelDiv.className = "attribute-label";
        labelDiv.innerHTML = attr.label;
        valueDiv.className = "attribute-value";
        valueDiv.id = s;
        barDiv.className = "bar";
        barDiv.id = `${s}-bar`;

        const attrBar = new ProgressBar(
          "character-changed",
          () => getAttrProgress(s),
          theme.colors.pastelGreen,
          { value: false },
          { height: "4px" }
        );
        attrBar.className = "bar";
        
        attrContainer.appendChild(attrRow);
        attrRow.appendChild(detailDiv);
        detailDiv.appendChild(labelDiv);
        detailDiv.appendChild(valueDiv);
        attrRow.appendChild(barDiv);
        barDiv.appendChild(attrBar);
      }

      this.render();
    };

    /*
      @param - Heal sets whether or not increase max hp also raises current by the same amount.
    */

    setMaxStat(stat, attr, mod, heal = true) {
      // Strength increases max hp.
      // Maybe also job modifier?
      const health = getStat(stat);
      const str = getAttr(attr);
      const strHealthModifier = mod;
      const baseHp = 1;
      let newHealthMax;
      let healthIncrease = 0;

      newHealthMax = str.level * strHealthModifier;
      if (health.max !== newHealthMax) {
        const healthDifference = newHealthMax - health.max;
        const newHealth = { ...health };
        newHealth.max = newHealthMax;

        if (heal) {
          newHealth.current += healthDifference;
        }

        setStat(stat, newHealth);
        this.render();
      }
    }

    render = () => {
      if (this.shadowRoot) {
        for (var key in player.attrs) {
          this.shadowRoot.getElementById(key).innerHTML = player.attrs[key].level;
        }
      }
    };
  }

  customElements.define("character-sheet", Character);
})();

export function getMaxHealth(actions) {
  window.player.availableActions = actions;
}

export function setAvailableActions(actions) {
  window.player.availableActions = actions;
}

export function getStat(stat) {
  return window.player.stats[stat];
}

export function setStat(stat, statData) {
  window.player.stats[stat] = statData;
}

export function getAttr(attr) {
  return window.player.attrs[attr];
}

export function getJobProgress() {
  return { current: window.player.job.level.exp, max: window.player.job.level.expNeeded };
}

export function getJob() {
  return window.player.job;
}

export function getAttrProgress(attr) {
  return { current: window.player.attrs[attr].exp, max: window.player.attrs[attr].expNeeded };
}

export function addAttrExp(attr, exp, level = false) {
  const { attrs } = window.player;

  // Add exp and handle levels
  const totalExpNeeded = 1 * Math.pow(1.1, attrs[attr].level);
  const currentExp = attrs[attr].exp;
  const expLeft = totalExpNeeded - (exp + currentExp);

  // Set the expNeeded
  attrs[attr].expNeeded = totalExpNeeded;

  if (expLeft < 0) {
    // If expLeft is less than zero than we have leveled up
    // Recursively call the function to continue to level.
    // Base case is when exp amount does not cause us to level up.
    attrs[attr].level++;
    attrs[attr].exp = 0;
    addAttrExp(attr, Math.abs(expLeft), true);
  } else {
    // Base case hit, call send out event for components to render.
    attrs[attr].exp = currentExp + exp;
    charChange();
    if (level) {
      attrLevel();
    }
  }
}

export function modifyStat(stat, value, whenResourcesEmpty = undefined, whenResourcesMax = undefined) {
  const { stats } = window.player;
  stats[stat].current += value;

  if (stats[stat].current > stats[stat].max) {
    stats[stat].current = stats[stat].max;
    if (whenResourcesMax) {
      whenResourcesMax();
    }
  }

  if (stats[stat].current < 0) {
    stats[stat].current = 0;
    if (whenResourcesEmpty) {
      whenResourcesEmpty();
    } else {
      // By default just stop the action
      setAction("rest");
    }
  }

  charChange();
}

export function setAction(action) {
  window.player.prevAction = window.player.action;
  window.player.action = action;
  actionChange();
}

export function actionChange(data = {}) {
  const event = new CustomEvent("action-changed", data);
  document.dispatchEvent(event);
}

export function charChange(data = {}) {
  const event = new CustomEvent("character-changed", data);
  document.dispatchEvent(event);
}

export function attrLevel(data = {}) {
  const event = new CustomEvent("attr-level", data);
  document.dispatchEvent(event);
}
