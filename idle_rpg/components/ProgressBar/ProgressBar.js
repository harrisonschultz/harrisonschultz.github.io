export class ProgressBar extends HTMLElement {
  constructor(event, getter, color, options = undefined, style = {}) {
    super();

    this.getter = getter;
    this.color = color;
    this.label = options.label;
    this.customStyle = style;
    this.options = options;

    // Register event to listen to
    document.addEventListener(event, this.render);
  }

  async connectedCallback() {
    const res = await fetch("components/ProgressBar/ProgressBar.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);
    this.initialRender();
  }

  initialRender = () => {
    const progress = this.shadowRoot.getElementById("progress");

    for (var x in this.customStyle) {
      progress.style[x] = this.customStyle[x];
    }

    progress.style.backgroundColor = this.color;

    if (this.label) {
      this.shadowRoot.getElementById("label").innerHTML = `${this.label[0].toUpperCase()}${this.label.substring(1)}`;
    }

    this.render();
  };

  render = () => {
    // Get value
    const data = this.getter();

    const progress = this.shadowRoot.getElementById("progress");
    const progressValue = this.shadowRoot.getElementById("progress-value");

    // set value
    if (this.options.value) {
      progressValue.innerHTML = `${data.current.toFixed(0)} / ${data.max.toFixed(0)}`;
    }

    // calcuate percentage
    const width = (data.current / data.max) * 100 - 100;

    progress.style.transform = `translate(${width}%)`;
  };
}

customElements.define("progress-bar", ProgressBar);
