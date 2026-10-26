# Changelog

## V0.3

- Added a strict intermediate Logic Model schema.
- Separated parsing, normalization, and validation.
- Added connected custom Blockly condition/action blocks.
- Added Blockly-to-Logic extraction and round-trip semantic comparison.
- Added workspace mutation and JSON import/export validation gates.
- Added automated round-trip mismatch tests.

## Scope and safety

- Browser-only prototype; no Deriv account connection, API keys, real orders, or automated trading.
- Next: expand grammar, strengthen semantic-equivalence coverage, complete reverse extraction for supported blocks, and add browser CI.
