const normalized = document.getElementById("normalized");
const validation = document.getElementById("validation");
const input = document.getElementById("input");

const workspace = Blockly.inject("blocklyDiv", {
  toolbox: LogicToolbox,
  scrollbars: true,
  trashcan: true
});

function renderLogic(logic) {
  workspace.clear();
  if (!logic || LogicValidator.validate(logic).length) return;

  const root = workspace.newBlock("logic_if");
  const condition = workspace.newBlock("candle_condition");
  const action = workspace.newBlock("logic_action");

  condition.setFieldValue(logic.condition.value, "DIR");
  action.setFieldValue(logic.action.type, "ACTION");

  root.initSvg(); condition.initSvg(); action.initSvg();
  root.render(); condition.render(); action.render();

  root.getInput("CONDITION").connection.connect(condition.outputConnection);
  root.getInput("ACTION").connection.connect(action.previousConnection);
  root.moveBy(30, 30);
}

function build() {
  const logic = LogicParser.normalize(input.value);
  const errors = LogicValidator.validate(logic);
  normalized.textContent = JSON.stringify(logic, null, 2);
  validation.textContent = errors.length ? errors.join("\n") : "OK";
  renderLogic(logic);
}

document.getElementById("build").addEventListener("click", build);
document.getElementById("save").addEventListener("click", () => {
  document.getElementById("workspaceJson").textContent =
    JSON.stringify(WorkspaceStorage.save(workspace), null, 2);
});
document.getElementById("load").addEventListener("click", () => {
  try {
    WorkspaceStorage.load(workspace, JSON.parse(document.getElementById("workspaceJson").textContent));
    validation.textContent = "Workspace loaded.";
  } catch (error) {
    validation.textContent = "Load error: " + error.message;
  }
});
build();