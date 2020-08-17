import { setAction, getAttr, setAvailableActions } from '../../Character/Character.js'
import { theme } from '../../theme.js';

export class SecondaryAttributes extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const res = await fetch("components/SecondaryAttributes/SecondaryAttributes.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    document.addEventListener('attr-level', this.render)

    this.intialRender();
  }

  intialRender = () => {
    const container = this.shadowRoot.getElementById("secondary-attributes");

    for (var p in secondaryAttributes) {
      const x = secondaryAttributes[p]
      const attributeDiv = document.createElement('div')
      const labelDiv = document.createElement('div')
      const valueDiv = document.createElement('div')
      
      container.appendChild(attributeDiv)
      attributeDiv.appendChild(labelDiv)
      attributeDiv.appendChild(valueDiv)

      attributeDiv.className = "secondary-attribute"
      labelDiv.className = "secondary-attributes-label"
      valueDiv.className = "secondary-attributes-value"
      attributeDiv.id = `secondary-attributes-row-${p}`
      labelDiv.id = `secondary-attributes-label-${p}`
      valueDiv.id = `secondary-attributes-value-${p}`
      labelDiv.innerHTML = x.label
      valueDiv.innerHTML = `${getSecondaryAttributeValue(x.attributes).toFixed(1)}%`
    }
  };

  render = () => {
    for (var p in secondaryAttributes) {
      const x = secondaryAttributes[p]
      const row = this.shadowRoot.getElementById(`secondary-attributes-row-${p}`)
      const valueDiv = this.shadowRoot.getElementById(`secondary-attributes-value-${p}`)

      const newValue = getSecondaryAttributeValue(x.attributes).toFixed(1)

      if ( newValue > valueDiv.innerHTML) {
        row.animate( [
          { color: theme.colors.monokaiGreen},
          { color: '#fff'},
        ], {
          duration: 1000,
          iterations: 1
        })
      }
      valueDiv.innerHTML = `${newValue}%`
    }
  }
}

customElements.define("secondary-attributes", SecondaryAttributes);

export function getSecondaryAttributeValue(attrs) {
  let value = 0
  for (const a of attrs) {
    value += getAttr(a.name).level * a.modifier
  }
  return value
}

export const secondaryAttributes = {
  critical: {
    label: 'Critical Chance',
    attributes: [{ name: 'per', modifier: 0.1}, { name: 'lck', modifier: 1}]
  },
  balance: {
    label: 'Balance',
    attributes: [{ name: 'str', modifier: 0.1}, { name: 'agi', modifier: 0.1}]
  },
  dodge: {
    label: 'Dodge',
    attributes: [{ name: 'per', modifier: 0.1}, { name: 'agi', modifier: 0.07}]
  },
  block: {
    label: 'Block',
    attributes: [{ name: 'per', modifier: 0.1}, { name: 'str', modifier: 0.05}, { name: 'agi', modifier: 0.05}]
  },
  deflect: {
    label: 'Deflect',
    attributes: [{ name: 'str', modifier: 0.15}, { name: 'agi', modifier: 0.08}]
  },
}
