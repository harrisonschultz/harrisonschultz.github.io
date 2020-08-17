import { addAttrExp, getAttr, attrLevel } from "../Character/Character.js";
import { getSecondaryAttributeValue } from "../components/SecondaryAttributes/SecondaryAttributes.js";



export class Combat extends HTMLElement {
  constructor() {
    super();
  }

 async connectedCallback() {
    const res = await fetch("./Combat/Combat.html");
const textTemplate = await res.text();
const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);
    this.render();
  }

  render() {}
}

customElements.define("combat-sheet", Combat);

export function calculateDamage(attack, attacker, defender) {
  let baseDmg;
  let finalDmg;

  for (const attr of attack) {
    baseDmg += getAttr(attr.name) * attr.modifier;
  }

  finalDmg = baseDmg;

  // Roll for critical strike
  getSecondaryAttributeValue("");
}
