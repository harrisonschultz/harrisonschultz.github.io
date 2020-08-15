import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from "../theme.js";

(async () => {
  const res = await fetch("/Character/Character.html");
  const textTemplate = await res.text();
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

  class Character extends HTMLElement {
    prevAction = "rest";
    action = "rest";

    attrs = {
      agi: { level: 1, exp: 0 },
      int: { level: 1, exp: 0 },
      lck: { level: 1, exp: 0 },
      per: { level: 1, exp: 0 },
      str: { level: 1, exp: 0 },
    };

    level = {
      level: 1,
      experience: 0,
    };

    stats = {
      health: { current: 1, max: 1 },
      stamina: { current: 10, max: 10 },
      mana: { current: 1, max: 1 },
      fatigue: { current: 10, max: 10 },
    };

    constructor() {
      super();

      if (window.player) {
        this.attrs = window.player.attrs;
        this.level = window.player.level;
        this.stats = window.player.stats;
      }

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
        stamina: theme.colors.pastelGreen,
        fatigue: theme.colors.pastelPurple
      }

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
      for (const s in window.player.attrs) {
        const attrBar = new ProgressBar(
          "character-changed",
          () => getAttrProgress(s),
          theme.colors.pastelBlue,
          { value: false },
          { height: "4px" }
        );
        this.shadowRoot.getElementById(`${s}-bar`).appendChild(attrBar);
        attrBar.className = "bar";
      }

      this.render();
    };

    render = () => {
      if (this.shadowRoot) {
        for (var key in player.attrs) {
          this.shadowRoot.getElementById(key).innerHTML = player.attrs[key].level;
        }
        this.shadowRoot.getElementById("level").innerHTML = player.level.level;
      }
    };
  }

  customElements.define("character-sheet", Character);
})();

export function setAvailableActions(actions) {
  window.player.availableActions = actions
}

export function getStat(stat) {
  return window.player.stats[stat];
}

export function getAttr(attr) {
  return window.player.attrs[attr]
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
