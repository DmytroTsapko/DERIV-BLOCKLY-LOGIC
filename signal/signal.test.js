const test = require("node:test");
const assert = require("node:assert/strict");
const { candleDirection, getMinuteSignal } = require("./minute-signal");
const candles = [
  { epoch: 120, open: 100, close: 102 },
  { epoch: 180, open: 102, close: 99 },
  { epoch: 240, open: 99, close: 99 }
];
test("Open/Close gives UP, DOWN, or NEUTRAL", () => {
  assert.equal(candleDirection({ epoch: 0, open: 10, close: 11 }), "UP");
  assert.equal(candleDirection({ epoch: 0, open: 10, close: 9 }), "DOWN");
  assert.equal(candleDirection({ epoch: 0, open: 10, close: 10 }), "NEUTRAL");
});
test("unfinished candle is not used", () => {
  const s = getMinuteSignal(candles, 239);
  assert.equal(s.sourceCandleEpoch, 120);
  assert.equal(s.direction, "UP");
});
test("latest completed candle takes effect at boundary", () => {
  const s = getMinuteSignal(candles, 240);
  assert.equal(s.sourceCandleEpoch, 180);
  assert.equal(s.direction, "DOWN");
  assert.equal(s.windowStartEpoch, 240);
  assert.equal(s.windowEndEpoch, 300);
});
test("doji is neutral", () => assert.equal(getMinuteSignal(candles, 300).direction, "NEUTRAL"));
test("missing history fails closed", () => assert.equal(getMinuteSignal([], 12).direction, "NO_SIGNAL"));
test("unaligned candle timestamp rejected", () => assert.throws(() => candleDirection({ epoch: 12, open: 1, close: 2 }), /align/));
test("duplicate candle timestamp rejected", () => assert.throws(() => getMinuteSignal([{epoch:0,open:1,close:2},{epoch:0,open:1,close:0}], 100), /Duplicate/));
