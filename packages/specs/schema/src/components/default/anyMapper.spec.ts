import {anyMapper} from "./anyMapper.js";

describe("anyMapper()", () => {
  it("should not generate schema is the value is null", () => {
    expect(anyMapper(null)).toEqual(null);
  });
});
