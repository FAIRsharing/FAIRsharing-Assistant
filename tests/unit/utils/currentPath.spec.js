import { describe, expect, it } from "vitest";
import currentPath from "@/utils/currentPath.js";

describe("currentPath.js", function () {
  it("can check currentPath method", () => {
    const routeQuery = {
      a: "somestring",
      b: 42,
      c: false,
    };

    const result = {
      a: "somestring",
      b: "42",
    };

    expect(currentPath(routeQuery)).toStrictEqual(result);
  });
});
