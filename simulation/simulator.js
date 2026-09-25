window.LogicSimulator = (() => {
  function evaluate(logic, candles) {
    const errors = LogicValidator.validate(logic);
    if (errors.length) return { ok: false, errors, trades: [], summary: null };

    const trades = candles.map((candle, index) => {
      const direction = candle.direction === "DOWN" ? "DOWN" : candle.direction === "UP" ? "UP" : null;
      const matched = direction === logic.condition.value;
      const result = matched
        ? (logic.action.type === "FALL" ? "FALL" : "RISE")
        : "NO_ACTION";

      return {
        index,
        candle: direction,
        conditionMatched: matched,
        action: result
      };
    });

    return {
      ok: true,
      errors: [],
      trades,
      summary: {
        candles: candles.length,
        conditionMatches: trades.filter(t => t.conditionMatched).length,
        actions: trades.filter(t => t.action !== "NO_ACTION").length
      }
    };
  }

  return { evaluate };
})();