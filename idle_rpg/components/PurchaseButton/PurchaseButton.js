import { isActionUnlocked } from "../../Actions/Actions.js";
import { AttributeNames } from "../../enums/AttributeNames.js";
import { accumulateValueInSeconds } from "../../core.js";

export class PurchaseButton extends HTMLElement {
   constructor(item, prefix, onClick, onPurchase, options = {}) {
      super();

      this.action = item;
      this.idPrefix = prefix;
      this.onClick = onClick;
      this.options = options;
      this.onPurchase = onPurchase;
   }

   async connectedCallback() {
      const res = await fetch("./components/PurchaseButton/PurchaseButton.html");
      const textTemplate = await res.text();
      const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

      const shadowRoot = this.attachShadow({ mode: "open" });
      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);

      document.addEventListener("action-purchased", this.render);

      this.initialRender();
   }

   initialRender = () => {
      const actionsContainer = this.shadowRoot.getRootNode();
      const button = document.createElement("button");
      const tt = document.createElement("div");

      // Create tooltip rewards
      for (const attr of this.action.attrs) {
         const attrDiv = document.createElement("div");
         const labelDiv = document.createElement("div");
         const valueDiv = document.createElement("div");

         attrDiv.className = "tooltip-row ";
         labelDiv.className = "tooltip-label";
         valueDiv.className = "tooltip-value gain";
         labelDiv.innerHTML = AttributeNames[attr.name];
         valueDiv.innerHTML = `+ ${accumulateValueInSeconds(attr.value)} xp/s`;

         attrDiv.appendChild(labelDiv);
         attrDiv.appendChild(valueDiv);
         tt.appendChild(attrDiv);
      }

      // Create tooltip drain
      for (const stat of this.action.stats) {
         const attrDiv = document.createElement("div");
         const labelDiv = document.createElement("div");
         const valueDiv = document.createElement("div");

         attrDiv.className = "tooltip-row";
         labelDiv.className = "tooltip-label";
         valueDiv.className = "tooltip-value drain";
         labelDiv.innerHTML = `${stat.name[0].toUpperCase()}${stat.name.substring(1)}`;
         valueDiv.innerHTML = `- ${Math.abs(accumulateValueInSeconds(stat.value))}/s`;

         attrDiv.appendChild(labelDiv);
         attrDiv.appendChild(valueDiv);
         tt.appendChild(attrDiv);
      }

      // Create tooltip cost
      if (!isActionUnlocked(this.action)) {
         const titleDiv = document.createElement("div");

         titleDiv.id = "tooltip-cost-title";

         for (const cost of this.action.cost) {
            const attrDiv = document.createElement("div");
            const labelDiv = document.createElement("div");
            const valueDiv = document.createElement("div");

            attrDiv.className = "tooltip-row cost";
            labelDiv.className = "tooltip-label";
            valueDiv.className = "tooltip-value";
            labelDiv.innerHTML = `Purchase`;
            valueDiv.innerHTML = `${cost.value} ${cost.name[0].toUpperCase()}${cost.name.substring(1)}`;

            attrDiv.appendChild(labelDiv);
            attrDiv.appendChild(valueDiv);
            titleDiv.appendChild(attrDiv);
         }
         tt.appendChild(titleDiv);
      }

      button.id = `${this.idPrefix}-${this.action.prop}`;
      button.innerHTML = this.options.label || this.action.label;
      tt.id = "tooltip";

      button.appendChild(tt);
      actionsContainer.appendChild(button);

      this.render();
   };

   render = () => {
      const button = this.shadowRoot.getElementById(`${this.idPrefix}-${this.action.prop}`);

      if (isActionUnlocked(this.action)) {
         button.className = "action-button";
         button.onclick = () => this.onClick(this.action);

         // Remove tooltip cost
         const tt = this.shadowRoot.getElementById("tooltip-cost-title");
         if (tt) {
            tt.remove();
         }
      } else {
         button.className = "action-button purchase-button";
         button.onclick = () => this.onPurchase(this.action);
      }
   };
}

customElements.define("purchase-button", PurchaseButton);
