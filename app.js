const normalized = document.getElementById("normalized");
const validation = document.getElementById("validation");
const simulation = document.getElementById("simulation");
const input = document.getElementById("input");
const saveButton = document.getElementById("save");
const loadButton = document.getElementById("load");
const simulateButton = document.getElementById("simulate");
const exportButton = document.getElementById("export");
const workspaceJson = document.getElementById("workspaceJson");

const workspace = Blockly.inject("blocklyDiv", {
  toolbox: LogicToolbox,
  scrollbars: true,
  trashcan: true
});

let sourceLogic = null;
let lastValidWorkspaceState = null;
let synchronizing = false;
let verificationTimer = null;

function setValidation(message, ok = false) {
  validation.textContent = message;
  validation.dataset.status = ok ? "ok" : "error";
}

function setGates(enabled) {
  saveButton.disabled = !enabled;
  loadButton.disabled = !enabled;
  simulateButton.disabled = !enabled;
  exportButton.disabled = !enabled;
}

function renderLogic(logic) {
  synchronizing = true;
  workspace.clear();

  const root = workspace.newBlock("logic_if");
  const condition = workspace.newBlock("candle_condition");
  const action = workspace.newBlock("logic_action");

  condition.setFieldValue(logic.condition.value, "DIR");
  action.setFieldValue(logic.action.type, "ACTION");

  root.initSvg();
  condition.initSvg();
  action.initSvg();
  root.render();
  condition.render();
  action.render();

  root.getInput("CONDITION").connection.connect(condition.outputConnection);
  root.getInput("ACTION").connection.connect(action.previousConnection);
  root.moveBy(30, 30);

  lastValidWorkspaceState = WorkspaceStorage.save(workspace);
  synchronizing = false;
}

function verifyWorkspace() {
  if (!sourceLogic) {
    setGates(false);
    return { ok: false, errors: ["No valid source Logic Model."] };
  }

  const result = LogicRoundTrip.verify(sourceLogic, workspace);
  setGates(result.ok);
  return result;
}

function restoreLastValidWorkspace() {
  if (!lastValidWorkspaceState) return;
  synchronizing = true;
  WorkspaceStorage.load(workspace, lastValidWorkspaceState);
  synchronizing = false;
}

function handleWorkspaceChange() {
  if (synchronizing || !sourceLogic) return;

  clearTimeout(verificationTimer);
  verificationTimer = setTimeout(() => {
    const result = verifyWorkspace();

    if (result.ok) {
      lastValidWorkspaceState = WorkspaceStorage.save(workspace);
      setValidation("OK — Blockly matches the source Logic Model.", true);
      return;
    }

    setValidation(
      "BLOCKED — " + result.errors.join("\n") +
      "\n\nSource model was not changed. Restoring the last valid Blockly state.",
      false
    );

    restoreLastValidWorkspace();
    setGates(true);
  }, 60);
}

function build() {
  const logic = LogicParser.normalize(input.value);
  const errors = LogicValidator.validate(logic);

  normalized.textContent = JSON.stringify(logic, null, 2);
  simulation.textContent = "";

  if (errors.length) {
    sourceLogic = null;
    lastValidWorkspaceState = null;
    workspace.clear();
    setValidation(errors.join("\n"), false);
    setGates(false);
    return;
  }

  sourceLogic = logic;
  renderLogic(sourceLogic);

  const result = verifyWorkspace();
  if (result.ok) {
    setValidation(
      "OK — Text → Logic Model → Blockly → Logic Model is semantically identical.",
      true
    );
  } else {
    setValidation(result.errors.join("\n"), false);
  }
}

document.getElementById("build").addEventListener("click", build);

saveButton.addEventListener("click", () => {
  const result = verifyWorkspace();
  if (!result.ok) {
    setValidation(
      "SAVE BLOCKED — Blockly does not match the source Logic Model.\n" +
      result.errors.join("\n"),
      false
    );
    return;
  }

  const state = WorkspaceStorage.save(workspace);
  lastValidWorkspaceState = state;
  workspaceJson.textContent = JSON.stringify(state, null, 2);
  setValidation("Workspace JSON saved after semantic verification.", true);
});

loadButton.addEventListener("click", () => {
  let state;

  try {
    state = JSON.parse(workspaceJson.textContent);
  } catch (error) {
    setValidation("LOAD BLOCKED — Invalid JSON: " + error.message, false);
    return;
  }

  const previousState = lastValidWorkspaceState;
  synchronizing = true;

  try {
    WorkspaceStorage.load(workspace, state);
  } catch (error) {
    synchronizing = false;
    restoreLastValidWorkspace();
    setValidation("LOAD BLOCKED — " + error.message, false);
    return;
  }

  synchronizing = false;

  const result = verifyWorkspace();
  if (!result.ok) {
    restoreLastValidWorkspace();
    if (previousState) lastValidWorkspaceState = previousState;
    setValidation(
      "LOAD BLOCKED — imported Blockly does not match the source Logic Model.\n" +
      result.errors.join("\n"),
      false
    );
    setGates(true);
    return;
  }

  lastValidWorkspaceState = state;
  setValidation("Workspace JSON loaded and verified against the source Logic Model.", true);
});

simulateButton.addEventListener("click", () => {
  const result = verifyWorkspace();
  if (!result.ok) {
    setValidation("SIMULATION BLOCKED — semantic verification failed.", false);
    simulation.textContent = "";
    return;
  }

  const candles = [
    { direction: "DOWN" },
    { direction: "UP" },
    { direction: "DOWN" },
    { direction: "DOWN" },
    { direction: "UP" }
  ];

  const output = LogicSimulator.evaluate(sourceLogic, candles);
  simulation.textContent = JSON.stringify(output, null, 2);
  setValidation("Simulation completed from the approved Logic Model.", true);
});

exportButton.addEventListener("click", () => {
  const result = verifyWorkspace();
  if (!result.ok) {
    setValidation("EXPORT BLOCKED — semantic verification failed.", false);
    return;
  }

  const payload = LogicExporter.exportLogic(
    sourceLogic,
    WorkspaceStorage.save(workspace)
  );

  LogicExporter.downloadJson("deriv-blockly-logic.json", payload);
  setValidation("Export completed from the verified Logic Model.", true);
});

workspace.addChangeListener(handleWorkspaceChange);
build();