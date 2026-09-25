window.LogicNormalizer = (() => {
  function normalize(parsed) {
    if (!parsed) return null;
    return LogicSchema.create(
      parsed.condition?.value ?? null,
      parsed.action?.type ?? null
    );
  }

  return { normalize };
})();