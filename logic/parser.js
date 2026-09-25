window.LogicParser = (() => {
  function parse(text) {
    const s = String(text || "").toLowerCase().trim();
    const direction = /красн|down|пад|вниз/.test(s) ? "DOWN"
      : /зел|green|up|рост|вверх/.test(s) ? "UP" : null;
    const action = /операц.*вниз|следующ.*вниз|fall|put|sell/.test(s) ? "FALL"
      : /операц.*вверх|следующ.*вверх|rise|call|buy/.test(s) ? "RISE" : null;
    return { condition: { source: "LAST_CANDLE", operator: "EQUALS", value: direction }, action: { type: action } };
  }
  function normalize(text) { return LogicNormalizer.normalize(parse(text)); }
  return { parse, normalize };
})();