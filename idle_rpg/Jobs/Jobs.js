import { getJob, getJobProgress } from '../Character/Character.js'
import { ProgressBar } from "../components/ProgressBar/ProgressBar.js";
import { theme } from '../theme.js';

export class JobsList extends HTMLElement {
  constructor() {
    super();

    document.addEventListener('job-level', this.render)
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
    const job = getJob()
    this.shadowRoot.getElementById("jobs-label").innerHTML = jobs[job.prop].label
    this.shadowRoot.getElementById("jobs-value").innerHTML = job.level.level

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
  }
}

customElements.define("jobs-list", JobsList);

export const jobs = {
  child: {
    label: 'Child',
    prop: 'child',
    description: 'You are child with no specific strengths.',
    level: { level: 1, exp: 0 },
    attack: {
      speed: 1.5,
      criticalDamage: 1.5,
      dmgModifiers: [{name: 'str', modifier: 0.3}, {name: 'agi', modifier: 0.3}],
      variance: 0.1 // gives attacks a range of damage by 10% either up or down.
    }
  },

  urchin: {
    label: 'Urchin',
    prop: 'urchin',
    description: 'As an urchin you have fend for yourself. Your strength and speed will be your only allies.',
    level: { level: 1, exp: 0 },
    attack: {
      speed: 1.5,
      criticalDamage: 1.5,
      dmgModifiers: [{name: 'str', modifier: 0.35}, {name: 'agi', modifier: 0.45}],
      variance: 0.1 // gives attacks a range of damage by 10% either up or down.
    }
  },

  student: {
    label: 'Student',
    prop: 'student',
    description: 'A student of the world, a young mind to be molded.',
    level: { level: 1, exp: 0 },
    attack: {
      speed: 2,
      criticalDamage: 1.8,
      dmgModifiers: [{name: 'int', modifier: 1}],
      variance: 0.15 // gives attacks a range of damage by 10% either up or down.
    }
  }
}
