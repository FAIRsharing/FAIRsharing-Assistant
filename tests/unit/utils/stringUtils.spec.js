import stringUtils from "@/utils/stringUtils.js";

describe("stringUtils.js", () => {

  it("formatString ", function () {
    expect(stringUtils.methods.formatString("Snake case")).toBe("snake_case");
  })

  it("normalString ", function () {
    expect(stringUtils.methods.normalString("snake_case")).toBe("Snake case");
  })

})