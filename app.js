const normalized = document.getElementById("normalized");
const validation = document.getElementById("validation");
const input = document.getElementById("input");

const toolbox = {
  kind: "flyoutToolbox",
  contents: [
    {kind:"block", type:"logic_if"},
    {kind:"block", type:"candle_condition"},
    {kind:"block", type:"logic_action"}
  ]
};

Blockly.common.defineBlocksWithJsonArray([
  {
    type:"candle_condition",
    message0:"Last Candle = %1",
    args0:[{type:"field_dropdown",name:"DIR",options:[["DOWN","DOWN"],["UP","UP"]]}],
    output:"Boolean",
    colour:210
  },
  {
    type:"logic_action",
    message0:"Action = %1",
    args0:[{type:"field_dropdown",name:"ACTION",options:[["FALL","FALL"],["RISE","RISE"]]}],
    previousStatement:null,
    nextStatement:null,
    colour:120
  }
]);

const workspace = Blockly.inject("blocklyDiv", {
  toolbox,
  scrollbars:true,
  trashcan:true
});

function build() {
  const logic = LogicParser.normalize(input.value);
  const errors = LogicParser.validate(logic);
  normalized.textContent = JSON.stringify(logic, null, 2);
  validation.textContent = errors.length ? errors.join("\n") : "OK";

  workspace.clear();

  const root = workspace.newBlock("logic_if");
  root.initSvg();
  root.render();

  const condition = workspace.newBlock("candle_condition");
  condition.setFieldValue(logic.condition.equals || "DOWN", "DIR");
  condition.initSvg();
  condition.render();

  const action = workspace.newBlock("logic_action");
  action.setFieldValue(logic.action || "FALL", "ACTION");
  action.initSvg();
  action.render();

  root.moveBy(30,30);
  condition.moveBy(30,130);
  action.moveBy(30,210);
}

document.getElementById("build").addEventListener("click", build);
build();