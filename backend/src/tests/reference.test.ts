import { describe, expect, it } from "vitest";
import { makeReference } from "../utils/numbers.js";
describe("makeReference", () => { it("creates requested prefix", () => expect(makeReference("XL")).toMatch(/^XL-\d{6}-\d{5}$/)); });
