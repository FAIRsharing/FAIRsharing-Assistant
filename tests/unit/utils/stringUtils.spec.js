import stringUtils from "@/utils/stringUtils.js";

describe("stringUtils.js", () => {

  it("formatString ", function () {
    expect(stringUtils.methods.formatString("Snake case")).toBe("snake_case");
  })

  it("normalString ", function () {
    expect(stringUtils.methods.normalString("snake_case")).toBe("Snake case");
  })

  it("capitaliseText when type is 'taxonomy' ", function () {
    expect(stringUtils.methods.capitaliseText("snake case", "taxonomy")).toBe("Snake case");
  })

  it("capitaliseText when type is NOT 'taxonomy' ", function () {
    expect(stringUtils.methods.capitaliseText("snake case", "any")).toBe("Snake Case");
  })

})