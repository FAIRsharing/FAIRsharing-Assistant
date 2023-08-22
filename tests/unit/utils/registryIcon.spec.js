import registryIcons from "@/utils/registryIcon";

describe("registryIcons.js", () => {

  it("registryIcons for registry 'Standard' ", function () {
    expect(registryIcons("Standard")).toBe("home_standard");
  })

  it("registryIcons for registry 'Database' ", function () {
    expect(registryIcons("Database")).toBe("home_db");
  })
  it("registryIcons for registry 'Policy' ", function () {
    expect(registryIcons("Policy")).toBe("home_policies");
  })
  it("registryIcons for registry 'Collection' ", function () {
    expect(registryIcons("Collection")).toBe("home_collections");
  })
  it("registryIcons for registry 'any' ", function () {
    expect(registryIcons("any")).toBe("home_standard");
  })


})