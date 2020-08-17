import { setAction, getAttr, setAvailableActions } from "../Character/Character.js";

export class Actions extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const res = await fetch("./Actions/Actions.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    document.addEventListener("action-changed", this.render);
    document.addEventListener("attr-level", this.renderActions);
    this.initialRender();
  }

  initialRender = () => {
    this.renderActions(true);
    this.render();
  };

  renderActions = (skip = false) => {
    if (skip || checkNewAvailableActions()) {
      const actionsContainer = this.shadowRoot.getElementById("actions-container");

      // Clear previous children
      for (const c of actionsContainer.children) {
        while (c.lastElementChild) {
          c.removeChild(c.lastElementChild);
        }
      }

      for (const act in actions) {
        if (!actions[act].conditions || areConditionsMet(actions[act].conditions)) {
          const button = document.createElement("button");
          const row = this.shadowRoot.getElementById(`tier-${actions[act].tier}`);

          row.appendChild(button);
          button.className = "action-button";
          button.id = act;
          button.innerHTML = actions[act].label;

          const seperator = document.createElement("div");
          row.appendChild(seperator);
          seperator.className = "button-seperator";

          if (act != "rest") {
            this.shadowRoot.getElementById(act).onclick = (event) => {
              event.target.animate([{ boxShadow: " 0px 0px 3px 2px rgba(255,255,255, 0.25)" }, { boxShadow: "none" }], {
                duration: 1000,
                iterations: 1,
              });
              setAction(act);
            };
          } else {
            // Set rest twice, to prevent resting from reverting back to the previous action.
            this.shadowRoot.getElementById(act).onclick = (event) => {
              event.target.animate([{ boxShadow: " 0px 0px 3px 2px rgba(255,255,255, 0.25)" }, { boxShadow: "none" }], {
                duration: 1000,
                iterations: 1,
              });
              setAction(act);
              setAction(act);
            };
          }
        }
      }
    }
  };

  render = () => {
    this.shadowRoot.getElementById("action-description").innerHTML = actions[window.player.action].description;
  };
}

customElements.define("actions-list", Actions);

function checkNewAvailableActions() {
  const availableActions = window.player.availableActions;
  const available = [];

  const isDifferent = false;

  for (const act of actions) {
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

export function areConditionsMet(conditions) {
  for (const s of conditions) {
    if (getAttr(s.name).level < s.value) {
      return false;
    }
  }

  return true;
}

export const actions = {
  "str-train-1": {
    type: "train",
    tier: 1,
    description: "Collecting Rocks",
    label: "Collect Rocks",
    attrs: [{ name: "str", value: 0.2 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "str-train-2": {
    type: "train",
    tier: 2,
    description: "Climbing",
    label: "Climb",
    conditions: [{ name: "str", value: 5 }],
    attrs: [
      { name: "str", value: 0.04 },
      { name: "agi", value: 0.01 },
    ],
    stats: [{ name: "fatigue", value: -0.2 }],
  },

  "agi-train-1": {
    type: "train",
    tier: 1,
    description: "Walking",
    label: "Walk",
    attrs: [{ name: "agi", value: 0.5 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "agi-train-2": {
    type: "train",
    tier: 2,
    description: "Running",
    label: "Run",
    conditions: [{ name: "agi", value: 5 }],
    attrs: [
      { name: "agi", value: 0.03 },
      { name: "str", value: 0.01 },
      { name: "per", value: 0.01 },
    ],
    stats: [{ name: "fatigue", value: -0.2 }],
  },

  "int-train-1": {
    type: "train",
    tier: 1,
    description: "Drawing",
    label: "Draw",
    attrs: [{ name: "int", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "int-train-2": {
    type: "train",
    tier: 2,
    description: "Reading",
    label: "Read",
    conditions: [{ name: "int", value: 5 }],
    attrs: [{ name: "int", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "per-train-1": {
    type: "train",
    tier: 1,
    description: "Watching Birds",
    label: "Watch Birds",
    attrs: [{ name: "per", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  rest: {
    type: "stat",
    tier: 1,
    description: "Resting",
    label: "Rest",
    stats: [{ name: "fatigue", value: 0.3 }],
    whenResourcesMax: () => setAction(window.player.prevAction),
  },
};

// adventure: {
//   type: "adventure",
//   tier: 2,
//   description: "Adventuring",
//   label: "Adventure",

// },
