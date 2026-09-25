# DERIV-BLOCKLY-LOGIC Architecture

## Runtime path

Android
→ Chrome / WebView
→ local browser application

Development path:

Android
→ Chrome
→ GitHub Codespaces
→ GitHub repository

## Logic pipeline

Text
→ Parser
→ Normalizer
→ Logic Schema
→ Validator
→ Blockly Renderer
→ JSON Save / Load
→ Automated Tests

## Semantic security gate

The Logic Model is the source of truth.

Text → Logic Model → Blockly → Logic Model

The reconstructed Logic Model must be semantically identical to the source model. A mismatch blocks save/load and restores the last valid workspace.

## Verification

1. Validate source Logic Model.
2. Render only validated Logic Model.
3. Observe Blockly mutations.
4. Convert Blockly back to Logic Model.
5. Compare canonical models.
6. Reject and restore on mismatch.

## Simulation

Simulation consumes only an approved Logic Model and an explicit candle dataset. It produces deterministic observations and does not connect to Deriv or place orders.

## Export

Export produces a versioned JSON artifact containing the approved Logic Model and its Blockly workspace state. Export is blocked when validation fails.

## Scope boundary

This project is a logic-construction and simulation prototype. It has no Deriv account connection, API keys, order execution, or automated trading.
