import { initialize } from "./init.js";
import { actions, Actions } from "./Actions/Actions.js";
import { Combat } from "./Combat/Combat.js"
import { addAttrExp, modifyStat } from "./Character/Character.js";
import { TabMenu } from "./components/TabMenu/TabMenu.js";

// Main loop
async function main() {
  let tick = 0;
  let tickRate = 100; // game ticks at 1/10 a second (in milliseconds).

  initialize();
  initialRender();

  while (true) {
    tick++;

    // perform selected action
    performAction();
    
    await regulateTickRate(tickRate);
  }
}

function initialRender() {
  // Render main view
  const tabContainer = document.getElementById('main-view')
  const tabMenu = new TabMenu([{
    label: 'Train',
    view: new Actions()
  },{
    label: 'Adventure',
    view: new Combat()
  }]) 
  
  tabContainer.appendChild(tabMenu)
}

function regulateTickRate(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function performAction() {
  const details = actions[window.player.action];

  if (details) {
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
      default:
        break;
    }
  }
}

main();