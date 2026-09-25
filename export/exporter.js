window.LogicExporter = (() => {
  function exportLogic(logic, workspaceState) {
    const errors = LogicValidator.validate(logic);
    if (errors.length) throw new Error("Export blocked: " + errors.join(" "));

    return JSON.stringify({
      format: "DERIV-BLOCKLY-LOGIC",
      version: "0.3",
      logic,
      workspace: workspaceState
    }, null, 2);
  }

  function downloadJson(filename, payload) {
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return { exportLogic, downloadJson };
})();