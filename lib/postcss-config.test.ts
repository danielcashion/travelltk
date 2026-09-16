import { describe, expect, it } from "vitest";
import config from "../postcss.config.mjs";

describe("postcss config", () => {
  it("exports the Tailwind PostCSS plugin map", () => {
    expect(config).toEqual({
      plugins: {
        "@tailwindcss/postcss": {},
      },
    });
  });
});
