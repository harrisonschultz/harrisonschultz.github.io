import { setAction, getAttr, setAvailableActions, payGold } from "../Character/Character.js";
import { Button } from "../components/Button/Button.js";
import { PurchaseButton } from "../components/PurchaseButton/PurchaseButton.js";

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

      document.addEventListener("attr-level", this.renderActions);

      this.initialRender();
   }

   initialRender = () => {
      this.renderActions(true);
   };

   renderActions = (skip = false) => {
      if (skip || checkNewAvailableActions()) {
         for (const act in actions) {
            if (!this.buttonsCreated.includes(act)) {
               let button;
               if (act === "rest") {
                  button = new Button(actions[act], "actions", (action) => {
                     setAction(action.key);
                     setAction(action.key);
                  });
               } else {
                  button = new PurchaseButton(
                     actions[act],
                     "actions",
                     (action) => setAction(action.key),
                     (action) => purchaseAction(action)
                  );
               }

               button.id = `button-${act}`;

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

export function isActionUnlocked(action) {
   if (action.cost) {
      return window.player.actionsUnlocked.includes(action.key);
   } else {
      return true;
   }
}

export function purchaseAction(action) {
   const gold = action.cost.find((c) => c.name === "gold");
   const goldCost = gold ? gold.value : undefined;
   if (goldCost && payGold(goldCost)) {
      window.player.actionsUnlocked.push(action.key);
      actionPurchased();
   }
}

export function actionPurchased(data = {}) {
   const event = new CustomEvent("action-purchased", data);
   document.dispatchEvent(event);
}

export const actions = {
   "str-train-1": {
      key: "str-train-1",
      type: "train",
      tier: 1,
      description: "Collecting Rocks",
      label: "Collect Rocks",
      attrs: [{ name: "str", value: 0.005 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "str-train-2": {
      key: "str-train-2",
      type: "train",
      tier: 2,
      description: "Climbing",
      label: "Climb",
      cost: [{ name: "gold", value: 10 }],
      attrs: [
         { name: "str", value: 0.015 },
         { name: "agi", value: 0.005 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "str-train-3": {
      key: "str-train-3",
      type: "train",
      tier: 3,
      description: "Lifting",
      label: "Lift",
      cost: [{ name: "gold", value: 1000 }],
      attrs: [{ name: "str", value: 0.11 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "str-train-4": {
      key: "str-train-4",
      type: "train",
      tier: 4,
      description: "Boasting",
      label: "Boast",
      cost: [{ name: "gold", value: 6000 }],
      attrs: [
         { name: "str", value: 0.25 },
         { name: "per", value: 0.15 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "agi-train-1": {
      key: "agi-train-1",
      type: "train",
      tier: 1,
      description: "Walking",
      label: "Walk",
      attrs: [{ name: "agi", value: 0.005 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "agi-train-2": {
      key: "agi-train-2",
      type: "train",
      tier: 2,
      description: "Running",
      label: "Run",
      cost: [{ name: "gold", value: 10 }],
      attrs: [
         { name: "agi", value: 0.015 },
         { name: "str", value: 0.005 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "agi-train-3": {
      key: "agi-train-3",
      type: "train",
      tier: 3,
      description: "Sparring",
      label: "Spar",
      cost: [{ name: "gold", value: 1000 }],
      attrs: [
         { name: "per", value: 0.02 },
         { name: "str", value: 0.05 },
         { name: "agi", value: 0.07 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "agi-train-4": {
      key: "agi-train-4",
      type: "train",
      tier: 4,
      description: "Chess Boxing",
      label: "Chess Box",
      cost: [{ name: "gold", value: 6000 }],
      attrs: [
         { name: "int", value: 0.18 },
         { name: "per", value: 0.07 },
         { name: "agi", value: 0.18 },
         { name: "str", value: 0.12 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "int-train-1": {
      key: "int-train-1",
      type: "train",
      tier: 1,
      description: "Drawing",
      label: "Draw",
      attrs: [{ name: "int", value: 0.005 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "int-train-2": {
      key: "int-train-2",
      type: "train",
      tier: 2,
      description: "Reading",
      label: "Read",
      cost: [{ name: "gold", value: 10 }],
      attrs: [{ name: "int", value: 0.005 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "int-train-3": {
      key: "int-train-3",
      type: "train",
      tier: 3,
      description: "Applying Knowledge",
      label: "Apply Knowledge",
      cost: [{ name: "gold", value: 1000 }],
      attrs: [
         { name: "int", value: 0.08 },
         { name: "str", value: 0.015 },
         { name: "agi", value: 0.015 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "int-train-4": {
      key: "int-train-4",
      type: "train",
      tier: 4,
      description: "Assimilate all knowledge",
      label: "Assimilate",
      cost: [{ name: "gold", value: 6000 }],
      attrs: [
         { name: "int", value: 0.27 },
         { name: "per", value: 0.1 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "per-train-1": {
      key: "per-train-1",
      type: "train",
      tier: 1,
      description: "Watching Birds",
      label: "Watch Birds",
      attrs: [{ name: "per", value: 0.005 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "per-train-2": {
      key: "per-train-2",
      type: "train",
      tier: 2,
      description: "Staring",
      label: "Stare",
      cost: [{ name: "gold", value: 10 }],
      attrs: [{ name: "per", value: 0.015 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "per-train-3": {
      key: "per-train-3",
      type: "train",
      tier: 3,

      description: "Pretending to be blind",
      label: "Fake Blindness",
      cost: [{ name: "gold", value: 1000 }],
      attrs: [
         { name: "per", value: 0.09 },
         { name: "int", value: 0.015 },
         { name: "str", value: 0.015 },
      ],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   "per-train-4": {
      key: "per-train-4",
      type: "train",
      tier: 4,

      description: "Practicing Echo Location",
      label: "Echo Location",
      cost: [{ name: "gold", value: 6000 }],
      attrs: [{ name: "per", value: 0.32 }],
      stats: [{ name: "fatigue", value: -0.1 }],
   },

   rest: {
      key: "rest",
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
