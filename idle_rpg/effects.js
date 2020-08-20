import { secondaryAttributes } from "./Character/Character.js";

export const effects = {
    critOnNextHit: {
        type: 'secondary-attribute',
        secondaryAttributes: [{ name: 'criticalChance', level: 100}],
        duration: 25
    }
}