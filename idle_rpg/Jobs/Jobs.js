import { getJob, getJobProgress } from '../Character/Character.js'
import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from '../../theme.js';

export class JobsDetails extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const res = await fetch("Jobs/Jobs.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    this.intialRender();
  }

  intialRender = () => {
    const job =  getJob()
    this.shadowRoot.getElementById("jobs-label").innerHTML = jobs[job.job].label
    this.shadowRoot.getElementById("jobs-value").innerHTML = job.level.level

    const attrBar = new ProgressBar(
      "jobs-level",
      () => getJobProgress(),
      theme.colors.pastelYellow,
      { value: false },
      { height: "4px" }
    );
    
    this.shadowRoot.getElementById(`jobs-bar`).appendChild(attrBar);
    attrBar.className = "bar";
  };

  render = () => {
    const job =  getJob()
    this.shadowRoot.getElementById("jobs-value").innerHTML = job.level.level
  }
}

customElements.define("jobs-details", JobsDetails);

export const jobs = {
  child: {
    label: 'Child',
    description: 'You are child with no specific strengths.',
    level: { level: 1, exp: 0 },
    attack: {
      dmgModifiers: [{name: 'str', modifier: 0.5}, {name: 'agi', modifier: 0.5}],
      variance: 0.1 // gives attacks a range of damage by 10% either up or down.
    }
  }
}
