import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const workflowPath = path.join(
  process.cwd(),
  ".github",
  "workflows",
  "vercel-production.yml",
);

describe("Vercel production workflow", () => {
  const workflow = readFileSync(workflowPath, "utf8");

  it("deploys directly instead of using the failing pull flow", () => {
    expect(workflow).not.toContain("vercel pull --yes --environment=production");
    expect(workflow).not.toContain("vercel build --prod");
    expect(workflow).toContain(
      "vercel deploy --prod --yes --token=${{ secrets.VERCEL_TOKEN }}",
    );
  });
});
