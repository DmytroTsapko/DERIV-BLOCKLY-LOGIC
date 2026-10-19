# Closed-candle minute signal — offline model

This module analyses completed one-minute OHLC candles only. It does not connect to Deriv, place orders, or implement a live DBot strategy.

## Rule
- A candle is closed only when `epoch + 60 <= nowEpoch`.
- `Close > Open` → `UP`.
- `Close < Open` → `DOWN`.
- `Close = Open` → `NEUTRAL`; do not infer a direction.
- Keep the signal fixed for the current 60-second window. Tick updates must not change it.
- Recompute when a new minute starts, using the latest completed candle.

Timestamps are Unix seconds for candle-open time and must align to a 60-second boundary. Validate feed timestamp semantics before using external data.

## Tests
Run `node --test signal/signal.test.js`.

## DBot integration limitation
The supplied XML scaffold uses the `digits/overunder` contract category and a fixed `DIGITUNDER` purchase. It does not extract candle Open/Close fields. This module verifies the signal calculation and timing only; it is not a ready-to-import DBot XML and does not execute trades.
