import { actions } from "../../Actions/Actions.js";

export class TabMenu extends HTMLElement {
   constructor(tabs) {
      super();

      this.views = tabs;

      // Register event to listen to
      document.addEventListener("tab-changed", this.render);
      document.addEventListener("action-changed", this.renderAction);
   }

   disconnectedCallback() {
      document.removeEventListener();
   }

   async connectedCallback() {
      const res = await fetch("components/TabMenu/TabMenu.html");
      const textTemplate = await res.text();
      const HTMLTemplate = new DOMParser().parseFromString(textTemplate, "text/html").querySelector("template");
      const shadowRoot = this.attachShadow({ mode: "open" });

      // Clone the template and the cloned node to the shadowDOM's root.
      const instance = HTMLTemplate.content.cloneNode(true);
      shadowRoot.appendChild(instance);
      this.initialRender();
      this.renderAction();
   }

   initialRender = () => {
      const tabList = this.shadowRoot.getElementById("tab-list");
      const mainView = this.shadowRoot.getElementById("main-view");

      // Create tabs
      for (const t of this.views) {
         const tabDiv = document.createElement("div");
         tabDiv.innerHTML = t.label;
         tabDiv.className = "tab";
         tabDiv.id = `tab-${t.label}`;
         if (window.player.tab === t.label) {
            tabDiv.className = "tab selected";
         }
         tabDiv.onclick = () => setTab(t.label);

         tabList.appendChild(tabDiv);
      }

      // Set main view
      for (const view of this.views) {
         const viewDiv = document.createElement("div");
         viewDiv.className = "view-container";
         viewDiv.id = `view-${view.label}`;
         mainView.appendChild(viewDiv);
         view.view.style.flex = 1;
         viewDiv.appendChild(view.view);
      }

      this.render();
   };

   render = () => {
      // Set main view
      const mainView = this.shadowRoot.getElementById("main-view");
      const tabList = this.shadowRoot.getElementById("tab-list");

      // Select tab
      for (const t of tabList.children) {
         t.className = "tab";
         if (t.id === `tab-${getTab()}`) {
            t.className = "tab selected";
            t.animate([{ boxShadow: "inset 0px 0px 2px 1px rgba(255,255,255, 0.5)" }, { boxShadow: "none" }], {
               duration: 1000,
               iterations: 1,
            });
         }
      }

      // Reveal selected view
      // Hide others
      for (const tab of this.views) {
         const currentView = this.shadowRoot.getElementById(`view-${tab.label}`);
         if (getTab() === tab.label) {
            currentView.className = "view-container visible";
         } else {
            currentView.className = "view-container";
         }
      }
   };

   renderAction = () => {
      if (actions[window.player.action]) {
         this.shadowRoot.getElementById("action-description").innerHTML = actions[window.player.action].description;
      } else if (window.player.action === "adventure") {
         this.shadowRoot.getElementById(
            "action-description"
         ).innerHTML = `Adventuring in ${window.player.adventure.label}`;
      }
   };
}

customElements.define("tab-menu", TabMenu);

function setTab(tab) {
   window.player.tab = tab;
   const event = new CustomEvent("tab-changed");
   document.dispatchEvent(event);
}

function getTab() {
   return window.player.tab;
}
