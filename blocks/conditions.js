Blockly.common.defineBlocksWithJsonArray([
  {
    type: "logic_if",
    message0: "IF %1 DO",
    args0: [{ type: "input_value", name: "CONDITION", check: "Boolean" }],
    message1: "%1",
    args1: [{ type: "input_statement", name: "ACTION" }],
    previousStatement: null,
    nextStatement: null,
    colour: 65
  },
  {
    type: "candle_condition",
    message0: "Last Candle = %1",
    args0: [{ type: "field_dropdown", name: "DIR", options: [["DOWN", "DOWN"], ["UP", "UP"]] }],
    output: "Boolean",
    colour: 210
  }
]);