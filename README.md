# DERIV-BLOCKLY-LOGIC

Browser-only prototype for converting ordinary language into a strict logic model and a connected Blockly representation.

## Architecture

User text → Parser → Normalizer → Logic Model → Validator → Blockly Renderer → JSON Save/Load → Tests

The Logic Model is the source of truth. Blockly is a visual representation, not the semantic source.

## Current V0.2

- Strict intermediate schema in `logic/schema.js`
- Parser and normalization separated
- Deterministic validator
- Connected custom Blockly IF / condition / action blocks
- Blockly JSON save/load using Blockly serialization
- Browser smoke tests for parser, validator and workspace serialization

## Example

Input: "если последняя свеча красная, следующая операция вниз"

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
│   └── normalizer.js
├── blocks/
│   ├── conditions.js
│   ├── actions.js
│   └── toolbox.js
├── storage/
│   └── workspace.js
└── tests/
    ├── parser.test.js
    ├── validator.test.js
    └── workspace.test.js
```

## Next development stage

1. Expand grammar without weakening the strict schema.
2. Add semantic alignment tests for text → model → blocks.
3. Add deterministic workspace → Logic Model extraction.
4. Add stronger invalid-input handling.
5. Add CI/browser tests before any export layer.
