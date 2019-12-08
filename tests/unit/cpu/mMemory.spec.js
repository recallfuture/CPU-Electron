import assert from "assert";
import { getMI, mCode } from "../../../src/cpu/mMemory";

describe("cpu/mMemory.js", () => {
  it("翻译微指令应该不能为null", () => {
    mCode.forEach(item => {
      assert(getMI(item[1]) !== null);
    });
  });
});
