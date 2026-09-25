window.LogicValidator = (() => {
  function validate(logic) {
    const errors = [];
    if (!logic || logic.type !== "IF") errors.push("Root type must be IF.");
    if (!logic?.condition) errors.push("Condition is missing.");
    if (logic?.condition?.source !== "LAST_CANDLE") errors.push("Condition source must be LAST_CANDLE.");
    if (logic?.condition?.operator !== "EQUALS") errors.push("Condition operator must be EQUALS.");
    if (!LogicSchema.isDirection(logic?.condition?.value)) errors.push("Condition value must be DOWN or UP.");
    if (!LogicSchema.isAction(logic?.action?.type)) errors.push("Action must be FALL or RISE.");
    return errors;
  }

  return { validate };
})();