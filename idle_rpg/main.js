import { initialize } from "./init.js";
import { actions, Actions } from "./Actions/Actions.js";
import { Combat, fight } from "./Combat/Combat.js";
import { addAttrExp, modifyStat, rest, elapseTime } from "./Character/Character.js";
import { TabMenu } from "./components/TabMenu/TabMenu.js";
import { Adventure } from "./Adventure/Adventure.js";
import { JobsList } from "./Jobs/Jobs.js";
import { save } from './core.js'

// Main loop
async function main() {
  let tick = 0;
  let tickRate = 100; // milliseconds per tick (default is 100 or 1/10 a second)

  initialize();
  initialRender();

  while (true) {
    tick++;

    // Tick buffs
    elapseTime()

    // perform selected action
    performAction(tick);

    await regulateTickRate(tickRate);

    // Save
    if (tick % 100) {
      save()
    }
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
      label: "Character",
      view: new JobsList(),
    },
  ]);

  tabContainer.appendChild(tabMenu);

  // Set reset button
  // document.getElementById('reset').onclick = () => {
  //   window.localStorage.clear()
  //   location.reload()
  // }
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
