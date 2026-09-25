window.ValidatorTests = {
  run() {
    const valid = LogicSchema.create("DOWN", "FALL");
    const invalid = LogicSchema.create(null, "FALL");
    return {
      validPasses: LogicValidator.validate(valid).length === 0,
      invalidFails: LogicValidator.validate(invalid).length > 0
    };
  }
};