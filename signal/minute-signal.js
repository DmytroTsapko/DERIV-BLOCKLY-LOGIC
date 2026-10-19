/**
 * Closed-candle minute signal analyzer — offline only.
 * No Deriv connection and no order execution.
 */
"use strict";
const MINUTE_SECONDS = 60;

function validateCandle(candle) {
  if (!candle || typeof candle !== "object") throw new TypeError("Candle must be an object.");
  for (const key of ["open", "close", "epoch"]) {
    if (!Number.isFinite(candle[key])) throw new TypeError(`Candle.${key} must be a finite number.`);
  }
  if (!Number.isInteger(candle.epoch) || candle.epoch < 0) throw new RangeError("Candle.epoch must be a non-negative Unix timestamp.");
  if (candle.epoch % MINUTE_SECONDS !== 0) throw new RangeError("Candle.epoch must align to a 60-second boundary.");
}
function candleDirection(candle) {
  validateCandle(candle);
  return candle.close > candle.open ? "UP" : candle.close < candle.open ? "DOWN" : "NEUTRAL";
}
function getMinuteSignal(candles, nowEpoch) {
  if (!Array.isArray(candles)) throw new TypeError("candles must be an array.");
  if (!Number.isFinite(nowEpoch) || nowEpoch < 0) throw new RangeError("nowEpoch must be a non-negative Unix timestamp.");
  const normalized = candles.map(c => ({ ...c, direction: candleDirection(c) }));
  const seen = new Set();
  for (const c of normalized) {
    if (seen.has(c.epoch)) throw new Error(`Duplicate candle epoch: ${c.epoch}`);
    seen.add(c.epoch);
  }
  const latestClosed = normalized
    .filter(c => c.epoch + MINUTE_SECONDS <= nowEpoch)
    .sort((a, b) => b.epoch - a.epoch)[0];
  const windowStartEpoch = Math.floor(nowEpoch / MINUTE_SECONDS) * MINUTE_SECONDS;
  const windowEndEpoch = windowStartEpoch + MINUTE_SECONDS;
  if (!latestClosed) return {
    ok: false, direction: "NO_SIGNAL", sourceCandleEpoch: null,
    windowStartEpoch, windowEndEpoch,
    reason: "No completed one-minute candle is available."
  };
  return {
    ok: true, direction: latestClosed.direction,
    sourceCandleEpoch: latestClosed.epoch,
    sourceCandleCloseEpoch: latestClosed.epoch + MINUTE_SECONDS,
    windowStartEpoch, windowEndEpoch,
    reason: latestClosed.direction === "NEUTRAL"
      ? "Open equals Close; no directional signal."
      : "Direction derived only from the last fully closed candle."
  };
}
if (typeof module !== "undefined" && module.exports) module.exports = { MINUTE_SECONDS, candleDirection, getMinuteSignal, validateCandle };
