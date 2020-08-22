import { isPlayer } from "../../Character/Character.js";

function initializeMessageComponents(message) {
   const msgDiv = document.createElement("div");
   msgDiv.className = "message";

   const sourceSpan = document.createElement("span");
   sourceSpan.innerHTML = message.source;

   const destSpan = document.createElement("span");
   destSpan.innerHTML = message.enemy;

   const valueSpan = document.createElement("span");
   valueSpan.className = "value-span";
   valueSpan.innerHTML = message.value ? message.value.toFixed(1) : "";

   const effectSpan = document.createElement("span");
   effectSpan.className = "effect-span";
   effectSpan.innerHTML = message.effect;

   if (isPlayer(message.source)) {
      sourceSpan.className = "player-span";
      destSpan.className = "enemy-span";
   } else {
      sourceSpan.className = "enemy-span";
      destSpan.className = "player-span";
   }

   return { msgDiv, sourceSpan, valueSpan, destSpan, effectSpan };
}

export function messageAttack(message) {
   const { msgDiv, sourceSpan, valueSpan, destSpan, effectSpan } = initializeMessageComponents(message);

   const text2 = document.createElement("span");
   text2.innerHTML = " for ";

   const text1 = document.createElement("span");
   text1.innerHTML = " hit ";

   msgDiv.appendChild(sourceSpan);
   msgDiv.appendChild(text1);
   msgDiv.appendChild(destSpan);
   msgDiv.appendChild(text2);

   if (isPlayer(message.source)) {
      valueSpan.className += " good";
   } else {
      valueSpan.className += " bad";
   }

   msgDiv.appendChild(valueSpan);

   return msgDiv;
}

export function messageDeath(message) {
   const { msgDiv, sourceSpan, valueSpan, effectSpan, destSpan } = initializeMessageComponents(message);

   if (isPlayer(message.source)) {
      effectSpan.className += " bad";
   } else {
      effectSpan.className += " good";
   }
   msgDiv.appendChild(sourceSpan);
   msgDiv.appendChild(effectSpan);

   return msgDiv;
}

export function messageAttackCritical(message) {
   const { msgDiv, sourceSpan, valueSpan, destSpan } = initializeMessageComponents(message);

   const text1 = document.createElement("span");
   text1.innerHTML = " hit ";

   const text2 = document.createElement("span");
   text2.innerHTML = " for ";

   const text3 = document.createElement("span");
   text3.innerHTML = " - Critical";

   msgDiv.appendChild(sourceSpan);
   msgDiv.appendChild(text1);
   msgDiv.appendChild(destSpan);
   msgDiv.appendChild(text2);

   if (isPlayer(message.source)) {
      valueSpan.className += " good";
   } else {
      valueSpan.className += " bad";
   }

   msgDiv.appendChild(valueSpan);
   msgDiv.appendChild(text3);

   return msgDiv;
}

export function messageBasic(message) {
   const { msgDiv, sourceSpan, valueSpan, effectSpan, destSpan } = initializeMessageComponents(message);

   if (isPlayer(message.source)) {
      msgDiv.appendChild(sourceSpan);
      effectSpan.className += " bad";
   } else {
      msgDiv.appendChild(destSpan);
      effectSpan.className += " good";
   }

   msgDiv.appendChild(effectSpan);

   return msgDiv;
}
