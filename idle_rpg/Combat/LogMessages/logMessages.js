function initializeMessageComponents(message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "message";

  const playerSpan = document.createElement("span");
  playerSpan.className = "player-span";
  playerSpan.innerHTML = "You";

  const enemySpan = document.createElement("span");
  enemySpan.className = "enemy-span";
  enemySpan.innerHTML = message.enemy;

  const valueSpan = document.createElement("span");
  valueSpan.className = "value-span";
  valueSpan.innerHTML = message.value ? message.value.toFixed(1) : '';

  const effectSpan = document.createElement("span");
  effectSpan.className = "effect-span";
  effectSpan.innerHTML = message.effect;

  return { msgDiv, playerSpan, valueSpan, enemySpan, effectSpan };
}

export function messagePlayerHit(message) {
  const { msgDiv, playerSpan, valueSpan, enemySpan } = initializeMessageComponents(message);
  const text = document.createElement('span')
  text.innerHTML = " were hit for "

  msgDiv.appendChild(playerSpan);
  msgDiv.appendChild(text);

  valueSpan.className += " bad";
  msgDiv.appendChild(valueSpan);

  return msgDiv;
}

export function messagePlayerAttack(message) {
  const { msgDiv, playerSpan, valueSpan, enemySpan } = initializeMessageComponents(message);

  const text = document.createElement('span')
  text.innerHTML = " was hit for "

  msgDiv.appendChild(enemySpan);
  msgDiv.appendChild(text);

  valueSpan.className += " good";
  msgDiv.appendChild(valueSpan);

  return msgDiv;
}
  
  export function messageEnemyDeath(message) {
    const { msgDiv, playerSpan, valueSpan, effectSpan, enemySpan } = initializeMessageComponents(message);
  
    msgDiv.appendChild(enemySpan);
    msgDiv.appendChild(effectSpan)
    effectSpan.className += " good";
  
    return msgDiv;
  }

    
  export function messagePlayerDeath(message) {
    const { msgDiv, playerSpan, valueSpan, effectSpan, enemySpan } = initializeMessageComponents(message);
  
    msgDiv.appendChild(playerSpan);
    msgDiv.appendChild(effectSpan)
    effectSpan.className += " bad";
  
    return msgDiv;
  }
  
