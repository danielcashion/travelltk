import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

function read(relativePath: string) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("Node 24 build configuration", () => {
  it("pins the app and infra packages to Node 24", () => {
    const appPackage = JSON.parse(read("package.json"));
    const infraPackage = JSON.parse(read("infra/package.json"));

    expect(appPackage.engines?.node).toBe("24.x");
    expect(infraPackage.engines?.node).toBe("24.x");
  });

  it("sets the Vercel workflows to Node 24", () => {
    const previewWorkflow = read(".github/workflows/vercel-preview.yml");
    const productionWorkflow = read(".github/workflows/vercel-production.yml");

    for (const workflow of [previewWorkflow, productionWorkflow]) {
      expect(workflow).toContain("uses: actions/setup-node@v4");
      expect(workflow).toContain("node-version: 24");
    }
  });
});
