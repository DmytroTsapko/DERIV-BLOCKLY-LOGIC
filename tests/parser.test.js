// Browser smoke-test helpers for the parser.
window.ParserTests = {
  run() {
    const cases = [
      ["если последняя свеча красная, следующая операция вниз", "DOWN", "FALL"],
      ["last candle green, next operation up", "UP", "RISE"]
    ];
    return cases.map(([input, direction, action]) => {
      const result = LogicParser.normalize(input);
      return {
        input,
        pass: result.condition.value === direction && result.action.type === action
      };
    });
  }
};