window.RoundTripTests = {
  run(workspace) {
    const source = LogicSchema.create("DOWN", "FALL");
    workspace.clear();

    const root = workspace.newBlock("logic_if");
    const condition = workspace.newBlock("candle_condition");
    const action = workspace.newBlock("logic_action");

    condition.setFieldValue("DOWN", "DIR");
    action.setFieldValue("FALL", "ACTION");

    root.initSvg();
    condition.initSvg();
    action.initSvg();
    root.render();
    condition.render();
    action.render();

    root.getInput("CONDITION").connection.connect(condition.outputConnection);
    root.getInput("ACTION").connection.connect(action.previousConnection);

    const result = LogicRoundTrip.verify(source, workspace);
    const originalPasses = result.ok;

    condition.setFieldValue("UP", "DIR");
    const mismatch = LogicRoundTrip.verify(source, workspace);

    return {
      originalPasses,
      mismatchDetected: !mismatch.ok,
      mismatchMessage: mismatch.errors.some(error => error.includes("Semantic mismatch"))
    };
  }
};