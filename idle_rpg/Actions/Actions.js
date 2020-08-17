import { setAction, getAttr, setAvailableActions } from "../Character/Character.js";
import { Button } from "../components/Button/Button.js";

export class Actions extends HTMLElement {
  constructor() {
    super();
    this.buttonsCreated = [];
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
      for (const act in actions) {
        if (
          (!actions[act].conditions || areConditionsMet(actions[act].conditions)) &&
          !this.buttonsCreated.includes(act)
        ) {
          let button;
          if (act === "rest") {
            button = new Button(actions[act], "actions", (act) => {
              setAction(act.prop);
              setAction(act.prop);
            });
          } else {
            button = new Button(actions[act], "actions", (act) => setAction(act.prop));
          }

          const row = this.shadowRoot.getElementById(`tier-${actions[act].tier}`);
          row.appendChild(button);

          const seperator = document.createElement("div");
          row.appendChild(seperator);
          seperator.className = "button-seperator";

          // Keep record of buttons on screen so they are not duped.
          this.buttonsCreated.push(act);
        }
      }
    }
  };

  render = () => {
    if (actions[window.player.action]) {
      this.shadowRoot.getElementById("action-description").innerHTML = actions[window.player.action].description;
    }
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
    prop: "str-train-1",
    type: "train",
    tier: 1,
    description: "Collecting Rocks",
    label: "Collect Rocks",
    attrs: [{ name: "str", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "str-train-2": {
    prop: "str-train-2",
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
    prop: "agi-train-1",
    type: "train",
    tier: 1,
    description: "Walking",
    label: "Walk",
    attrs: [{ name: "agi", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "agi-train-2": {
    prop: "agi-train-2",
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
    prop: "int-train-1",
    type: "train",
    tier: 1,
    description: "Drawing",
    label: "Draw",
    attrs: [{ name: "int", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "int-train-2": {
    prop: "int-train-2",
    type: "train",
    tier: 2,
    description: "Reading",
    label: "Read",
    conditions: [{ name: "int", value: 5 }],
    attrs: [{ name: "int", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  "per-train-1": {
    prop: "per-train-1",
    type: "train",
    tier: 1,
    description: "Watching Birds",
    label: "Watch Birds",
    attrs: [{ name: "per", value: 0.01 }],
    stats: [{ name: "fatigue", value: -0.1 }],
  },

  rest: {
    prop: "rest",
    type: "rest",
    tier: 1,
    description: "Resting",
    label: "Rest",
    stats: [
      { name: "fatigue", value: 0.3 },
      { name: "health", value: 0.3 },
    ],
  },
};

// adventure: {
//   type: "adventure",
//   tier: 2,
//   description: "Adventuring",
//   label: "Adventure",

// },
