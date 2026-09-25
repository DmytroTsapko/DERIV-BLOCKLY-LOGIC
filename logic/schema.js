window.LogicSchema = (() => {
  const DIRECTIONS = ["DOWN", "UP"];
  const ACTIONS = ["FALL", "RISE"];

  function create(condition, action) {
    return {
      version: "0.2",
      type: "IF",
      condition: {
        source: "LAST_CANDLE",
        operator: "EQUALS",
        value: condition
      },
      action: {
        type: action
      }
    };
  }

  function isDirection(value) {
    return DIRECTIONS.includes(value);
  }

  function isAction(value) {
    return ACTIONS.includes(value);
  }

  return { DIRECTIONS, ACTIONS, create, isDirection, isAction };
})();