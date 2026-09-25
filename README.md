# DERIV-BLOCKLY-LOGIC

Browser-only prototype for converting ordinary language into a strict Logic Model and a connected Blockly representation.

## Architecture

```text
Text
  ↓
Parser
  ↓
Normalizer
  ↓
Logic Schema
  ↓
Validator
  ↓
Blockly Renderer
  ↓
JSON Save / Load
  ↓
Automated Tests
```

The Logic Model is the semantic source of truth.

## Bidirectional semantic gate

The application verifies the complete round trip:

```text
Text
  ↓
Logic Model
  ↓
Blockly
  ↓
Logic Model
```

The reconstructed model from Blockly is canonicalized and compared with the original source model.

Therefore:

- changing a Blockly value that changes semantics is detected;
- loading incompatible Workspace JSON is rejected;
- incompatible Blockly state is automatically restored to the last valid state;
- JSON save is allowed only after semantic verification.

Blockly is a visual representation of the approved Logic Model, not an independent source of executable meaning.

## Current V0.3

- Strict intermediate schema in `logic/schema.js`
- Parser and normalization separated
- Deterministic schema validation
- Connected custom Blockly IF / condition / action blocks
- Reverse Blockly → Logic Model extraction
- Canonical semantic comparison
- Workspace mutation gate
- JSON import/export gate
- Automated round-trip mismatch test

## Example

Input:

"если последняя свеча красная, следующая операция вниз"

Normalized model:

```json
{
  "version": "0.2",
  "type": "IF",
  "condition": {
    "source": "LAST_CANDLE",
    "operator": "EQUALS",
    "value": "DOWN"
  },
  "action": {
    "type": "FALL"
  }
}
```

Round-trip requirement:

```text
normalize(text) === BlocklyToLogic(render(normalize(text)))
```

## Scope

- Browser-only
- No Deriv account connection
- No API keys
- No real orders
- No automated trading

## Structure

```text
DERIV-BLOCKLY-LOGIC/
├── index.html
├── style.css
├── app.js
├── logic/
│   ├── parser.js
│   ├── schema.js
│   ├── validator.js
│   ├── normalizer.js
│   └── roundtrip.js
├── blocks/
│   ├── conditions.js
│   ├── actions.js
│   └── toolbox.js
├── storage/
│   └── workspace.js
└── tests/
    ├── parser.test.js
    ├── validator.test.js
    ├── workspace.test.js
    └── roundtrip.test.js
```

## Next stage

1. Expand grammar without weakening the schema.
2. Add semantic-equivalence tests for more logic patterns.
3. Make Workspace → Logic Model extraction cover every supported block type.
4. Add browser CI to execute the automated test suite.
5. Add export only after semantic invariants remain green.
