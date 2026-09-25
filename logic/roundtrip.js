window.LogicRoundTrip = (() => {
  function canonical(logic) {
    if (!logic) return null;
    return {
      version: logic.version,
      type: logic.type,
      condition: {
        source: logic.condition?.source,
        operator: logic.condition?.operator,
        value: logic.condition?.value
      },
      action: {
        type: logic.action?.type
      }
    };
  }

  function equal(a, b) {
    return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
  }

  function fromWorkspace(workspace) {
    const errors = [];
    const topBlocks = workspace.getTopBlocks(true);

    if (topBlocks.length !== 1) {
      errors.push("Workspace must contain exactly one root block.");
      return { logic: null, errors };
    }

    const root = topBlocks[0];
    if (root.type !== "logic_if") {
      errors.push("Root block must be logic_if.");
      return { logic: null, errors };
    }

    const condition = root.getInputTargetBlock("CONDITION");
    const action = root.getInputTargetBlock("ACTION");

    if (!condition || condition.type !== "candle_condition") {
      errors.push("IF must contain exactly one candle_condition.");
    }

    if (!action || action.type !== "logic_action") {
      errors.push("IF must contain exactly one logic_action.");
    }

    if (action && action.getNextBlock()) {
      errors.push("Action chain contains unsupported extra blocks.");
    }

    if (condition && condition.getChildren(false).length > 0) {
      errors.push("Condition block cannot contain child blocks.");
    }

    if (errors.length) return { logic: null, errors };

    return {
      logic: LogicSchema.create(
        condition.getFieldValue("DIR"),
        action.getFieldValue("ACTION")
      ),
      errors: []
    };
  }

  function verify(expectedLogic, workspace) {
    const extracted = fromWorkspace(workspace);
    const expectedErrors = LogicValidator.validate(expectedLogic);
    const actualErrors = LogicValidator.validate(extracted.logic);

    const errors = [
      ...expectedErrors.map(error => "SOURCE: " + error),
      ...extracted.errors.map(error => "WORKSPACE: " + error),
      ...actualErrors.map(error => "WORKSPACE MODEL: " + error)
    ];

    if (!errors.length && !equal(expectedLogic, extracted.logic)) {
      errors.push("Semantic mismatch: Blockly model differs from source Logic Model.");
    }

    return {
      ok: errors.length === 0,
      expected: canonical(expectedLogic),
      actual: canonical(extracted.logic),
      errors
    };
  }

  return { canonical, equal, fromWorkspace, verify };
})();