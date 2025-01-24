import registryName from "@/utils/registryName";
import { describe, expect, it } from "vitest";

describe("registryName.js", () => {
  it("registryName for registry 'Standard' ", function () {
    expect(registryName("Standard")).toBe("Standards");
  });

  it("registryName for registry 'Database' ", function () {
    expect(registryName("Database")).toBe("Databases");
  });
  it("registryName for registry 'Policy' ", function () {
    expect(registryName("Policy")).toBe("Policies");
  });
  it("registryName for registry 'Collection' ", function () {
    expect(registryName("Collection")).toBe("Collections");
  });
  it("registryName for registry 'any' ", function () {
    expect(registryName("any")).toBe("any");
  });
});
