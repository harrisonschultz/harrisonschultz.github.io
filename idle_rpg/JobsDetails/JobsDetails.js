import { getJob, getJobProgress, getSkillPoints } from '../Character/Character.js'
import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from '../theme.js';
import { jobs } from '../Jobs/Jobs.js'

export class JobsDetails extends HTMLElement {
  constructor() {
    super();

    document.addEventListener('job-level', this.render)
  }

  async connectedCallback() {
    const res = await fetch("JobsDetails/JobsDetails.html");
    const textTemplate = await res.text();
    const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Clone the template and the cloned node to the shadowDOM's root.
    const instance = HTMLTemplate.content.cloneNode(true);
    shadowRoot.appendChild(instance);

    this.intialRender();
  }

  intialRender = () => {
    const job = getJob()
    this.shadowRoot.getElementById("jobs-label").innerHTML = jobs[job.prop].label
    this.shadowRoot.getElementById("jobs-value").innerHTML = job.level.level
    this.shadowRoot.getElementById("job-skill-points-value").innerHTML = getSkillPoints(job.prop)

    const attrBar = new ProgressBar(
      "job-progress",
      () => getJobProgress(),
      theme.colors.pastelYellow,
      { value: true, duration: 0.8, resetOnOverflow: true },
      { height: "4px" }
    );
    
    this.shadowRoot.getElementById(`jobs-bar`).appendChild(attrBar);
    attrBar.className = "bar";
  };

  render = () => {
    const job =  getJob()
    this.shadowRoot.getElementById("jobs-value").innerHTML = `${job.level.level}`
    this.shadowRoot.getElementById("job-skill-points-value").innerHTML = getSkillPoints(job.prop)
  }
}

customElements.define("jobs-details", JobsDetails);

