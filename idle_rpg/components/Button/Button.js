export class Button extends HTMLElement {
  constructor(item, prefix, onClick, label) {
    super();

    this.action = item;
    this.idPrefix = prefix;
    this.onClick = onClick;
    this.label = label
  }

  async connectedCallback() {
    const res = await fetch("./components/Button/Button.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");

    const shadowRoot = this.attachShadow({ mode: "open" });
    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    this.initialRender();
  }

  initialRender = () => {
    const actionsContainer = this.shadowRoot.getRootNode();
    const button = document.createElement("button");

    button.className = "action-button";
    button.id = `${this.idPrefix}-${this.action.prop}`;
    button.innerHTML = this.label || this.action.label;

    button.onclick = (event) => {
      event.target.animate([{ boxShadow: " 0px 0px 3px 2px rgba(255,255,255, 0.25)" }, { boxShadow: "none" }], {
        duration: 1000,
        iterations: 1,
      });
      this.onClick(this.action);
    };

    actionsContainer.appendChild(button);
  };
}

customElements.define("custom-button", Button);
