// Product version, Compose image tags, deployment guidance, and runtime
// environment files must agree. Publication automation is not active.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "dotenv";

const repoRoot = path.resolve(__dirname, "../../../..");
const read = (relative: string) => readFileSync(path.join(repoRoot, relative), "utf8");
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

describe("product version", () => {
    const version = read("VERSION").trim();

    it("is a semver string without build metadata", () => {
        expect(version).toMatch(SEMVER);
        expect(read("VERSION")).toBe(`${version}\n`);
    });

    it("is the default image tag for every published image in docker-compose.yml", () => {
        const compose = read("infra/docker-compose.yml");
        const tags = [...compose.matchAll(/northwrit-(api|web):\$\{NORTHWRIT_IMAGE_TAG:-([^}]+)\}/g)];
        expect(tags.map((m) => m[1]).sort()).toEqual(["api", "web"]);
        for (const [, image, tag] of tags) {
            expect(tag, `default tag of the ${image} image`).toBe(version);
        }
    });

    it("is what the deployment docs tell operators to pin", () => {
        const deployment = read("docs/engineering/deployment.md");
        expect(deployment).toContain(`NORTHWRIT_IMAGE_TAG=${version}`);
    });

    it("preserves published image release identity when the sample env_file is applied", () => {
        const imageEnv = { NORTHWRIT_VERSION: version, GIT_SHA: "0123456789abcdef" };
        const runtimeEnv = { ...imageEnv, ...parse(read("infra/.env.example")) };
        expect(runtimeEnv.NORTHWRIT_VERSION).toBe(version);
        expect(runtimeEnv.GIT_SHA).toBe(imageEnv.GIT_SHA);
    });

});
