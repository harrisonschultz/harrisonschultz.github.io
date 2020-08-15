import { setAction, getAttr, setAvailableActions } from "/Character/Character.js";

(async () => {
  const res = await fetch("/Actions/Actions.html");
  const textTemplate = await res.text();
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

  class Actions extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: "open" });
      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      document.addEventListener("action-changed", this.render);
      document.addEventListener('attr-level', this.renderActions);
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
        while (actionsContainer.lastElementChild) {
          actionsContainer.removeChild(actionsContainer.lastElementChild);
        }

        for (const act in actions) {
          if (!actions[act].conditions || areConditionsMet(actions[act].conditions)) {
            const button = document.createElement("button");
            actionsContainer.appendChild(button);
            button.className = 'action-button'
            button.id = act
            button.innerHTML = actions[act].label;
  
            const seperator = document.createElement("div");
            actionsContainer.appendChild(seperator);
            seperator.className='button-seperator'
  
            if (act != "rest") {
              this.shadowRoot.getElementById(act).onclick = () => {
                setAction(act);
              };
            } else {
              // Set rest twice, to prevent resting from reverting back to the previous action.
              this.shadowRoot.getElementById(act).onclick = () => {
                setAction(act);
                setAction(act);
              };
            }
          }
        }
      }
    }

    render = () => {
      this.shadowRoot.getElementById("action-description").innerHTML = actions[window.player.action].description;
    };
  }

  customElements.define("actions-list", Actions);
})();

function checkNewAvailableActions() {
  console.log('checking')
  const availableActions = window.player.availableActions
  const available = []

  const isDifferent = false

  for (const act of actions) {
    if (act.conditions) {
        const met = areConditionsMet(act.conditions)
        available.push(met)

        const lastIndex = available.length -1
        isDifferent = !availableActions[lastIndex] || available[lastIndex] !== availableActions[lastIndex]
    } 
  }
  setAvailableActions(available)
  return isDifferent
}

export function areConditionsMet(conditions) {

  for (const s of conditions) {
    if (getAttr(s.name).level < s.value) {
      return false
    }
  }

  return true
} 

export const actions = {
  "str-train-1": {
    type: "train",
    description: "Collecting Rocks",
    label: "Collect Rocks",
    attrs: [{ name: "str", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "str-train-2": {
    type: "train",
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
    description: "Walking",
    label: "Walk",
    attrs: [{ name: "agi", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "agi-train-2": {
    type: "train",
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
    description: "Drawing",
    label: "Draw",
    attrs: [{ name: "int", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "int-train-2": {
    type: "train",
    description: "Reading",
    label: "Read",
    conditions: [{ name: "int", value: 5 }],
    attrs: [{ name: "int", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "per-train-1": {
    type: "train",
    description: "Watching Birds",
    label: "Watch Birds",
    attrs: [{ name: "per", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  rest: {
    type: "stat",
    description: "Resting",
    label: "Rest",
    stats: [{ name: "fatigue", value: 0.3 }],
    whenResourcesMax: () => setAction(window.player.prevAction),
  },
};
