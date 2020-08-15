import { initialize } from "./init.js";
import { actions } from "./Actions/Actions.js";
import { addAttrExp, modifyStat } from "./Character/Character.js";

// Main loop
async function main() {
  let tick = 0;
  let tickRate = 100; // game ticks at 1/10 a second (in milliseconds).

  initialize();

  while (true) {
    tick++;

    // perform selected action
    performAction();
    
    await regulateTickRate(tickRate);
  }
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
// 'str-train-1': {
//   type: 'train',
//   value: 0.01,
//   fatigue: 0.5,
//   attr: 'str'
// },
