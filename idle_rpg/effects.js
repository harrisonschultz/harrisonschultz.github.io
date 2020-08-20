import { secondaryAttributes } from "./Character/Character.js";

export const effects = {
    opportunistic: {
        label: 'Opportunistic',
        key: 'opportunistic',
        type: "criticalChance",
        func: (data) => 100,
        duration: 25,
    }
}