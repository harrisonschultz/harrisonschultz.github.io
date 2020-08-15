import { addAttrExp } from "../Character/Character.js";

(async () => {
  const res = await fetch("/Combat/Combat.html");
  const textTemplate = await res.text();
  const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

  class Combat extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: "open" });

      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);
      this.render();
    }

    render() {}
  }

  customElements.define("combat-sheet", Combat);
})();
