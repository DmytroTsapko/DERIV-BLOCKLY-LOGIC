# DERIV-BLOCKLY-LOGIC

Browser prototype for converting ordinary language into normalized logic and a Blockly visual representation.

## Flow

User text → parser → normalized logic → Blockly → validation

## Scope

- Browser-only prototype
- No Deriv account connection
- No API keys
- No real orders
- No automated trading

## Initial example

"если последняя свеча красная, следующая операция вниз"

becomes:

IF LAST_CANDLE = DOWN → ACTION = FALL

## Structure

- index.html
- style.css
- app.js
- logic/parser.js

## Research basis

The design follows established work on visual DSLs and natural-language-to-block programming. Current Blockly documentation recommends JSON serialization for new projects and supports custom block definitions using JSON/JavaScript.

## Next stages

1. Expand the parser grammar.
2. Add deterministic validation.
3. Add Blockly JSON save/load.
4. Add test cases and semantic-alignment checks.
5. Add export only after the logic layer is stable.
