import { secondaryAttributes } from "./Character/Character";

export const effects = {
    critOnNextHit: {
        type: 'secondary-attribute',
        secondaryAttributes: [{ name: 'criticalChance', level: 100}],
        duration: 25
    }
}