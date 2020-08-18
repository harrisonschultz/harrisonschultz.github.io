import { initialize } from "./init.js";
import { actions, Actions } from "./Actions/Actions.js";
import { Combat, fight } from "./Combat/Combat.js";
import { addAttrExp, modifyStat, rest } from "./Character/Character.js";
import { TabMenu } from "./components/TabMenu/TabMenu.js";
import { Adventure } from "./Adventure/Adventure.js";
import { JobsList } from "./Jobs/Jobs.js";

// Main loop
async function main() {
  let tick = 0;
  let tickRate = 100; // game ticks at 1/10 a second (in milliseconds).

  initialize();
  initialRender();

  while (true) {
    tick++;

    // perform selected action
    performAction(tick);

    await regulateTickRate(tickRate);
  }
}

function initialRender() {
  // Render main view
  const tabContainer = document.getElementById("main-view");
  const tabMenu = new TabMenu([
    {
      label: "Train",
      view: new Actions(),
    },
    {
      label: "Adventure",
      view: new Adventure(),
    },
    {
      label: "Classes",
      view: new JobsList(),
    },
  ]);

  tabContainer.appendChild(tabMenu);
}

function regulateTickRate(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function performAction(tick) {
  let details = actions[window.player.action];

  // If the action does not have properties, just run the actions name.
  if (!details) {
    details = { type: window.player.action };
  }

  switch (details.type) {
    case "train":
      details.attrs.forEach((attr) => {
        addAttrExp(attr.name, attr.value);
      });
      details.stats.forEach((stat) => {
        modifyStat(stat.name, stat.value, details.whenResourcesEmpty, details.whenResourcesMax);
      });
      break;
    case "stat":
      details.stats.forEach((stat) => {
        modifyStat(stat.name, stat.value, details.whenResourcesEmpty, details.whenResourcesMax);
      });
      break;
    case "rest":
      rest();
      break;
    case "adventure":
      fight(tick);
      break;
    default:
      break;
  }
}

main();
