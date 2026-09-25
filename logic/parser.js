window.LogicParser = (() => {
  function normalize(text) {
    const s = text.toLowerCase().trim();
    const candleDown = /красн|down|пад|вниз/.test(s);
    const candleUp = /зел|up|рост|вверх/.test(s);
    let condition = null;
    let action = null;

    if (candleDown) condition = "DOWN";
    else if (candleUp) condition = "UP";

    if (/операц.*вниз|следующ.*вниз|fall|put|sell/.test(s)) action = "FALL";
    else if (/операц.*вверх|следующ.*вверх|rise|call|buy/.test(s)) action = "RISE";

    return {
      type: "IF",
      condition: { variable: "LAST_CANDLE", equals: condition },
      action
    };
  }

  function validate(logic) {
    const errors = [];
    if (!logic.condition?.equals) errors.push("Condition is missing.");
    if (!logic.action) errors.push("Action is missing.");
    return errors;
  }

  return { normalize, validate };
})();