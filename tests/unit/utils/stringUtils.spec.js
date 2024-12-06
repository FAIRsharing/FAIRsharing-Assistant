import stringUtils from "@/utils/stringUtils.js";
import { describe, expect, it } from 'vitest'

describe("stringUtils.js", () => {

  it("formatString ", function () {
    expect(stringUtils.methods.formatString("Snake case")).toBe("snake_case");
  })

  it("normalString ", function () {
    expect(stringUtils.methods.normalString("snake_case")).toBe("Snake case");
  })

  it("humaniseKey ", function () {
    expect(stringUtils.methods.humaniseKey("camelCase")).toBe("Camel case");
  })

  it("capitaliseText when type is 'taxonomy' ", function () {
    expect(stringUtils.methods.capitaliseText("snake case", "taxonomy")).toBe("Snake case");
  })

  it("capitaliseText when type is NOT 'taxonomy' ", function () {
    expect(stringUtils.methods.capitaliseText("snake case", "any")).toBe("Snake Case");
  })

})