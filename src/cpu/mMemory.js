import Memory from "./memory";
import Constant from "./constant";

const mMemory = new Memory();

/**
 * 根据微命令数组计算出对应的微指令
 * @param {Array} arr 微命令数组
 */
export function getMI(arr) {
  let result = 0;
  arr.forEach(code => {
    if (typeof Constant.M_INSTRUCTION[code] === "undefined") {
      return null;
    }
    result += Constant.M_INSTRUCTION[code];
  });
  return result;
}

export const mCode = [
  // [微地址，微指令，测试字段，下址]
  [
    0b0000,
    ["PC->BUS", "BUS->IMAR", "READ", "CLEAR LA", "1->C0", "ADD", "ALU->LT"],
    0,
    0b0001
  ], // A
  [0b0001, ["LT->BUS", "BUS->PC", "WAIT"], 0, 0b0010], // B
  [0b0010, ["IMDR->BUS", "BUS->IR"], 1, 0b0100], // C
  [0b0011, ["Rd->BUS", "BUS->RD"], 2, 0b1000], // H
  [0b0100, ["TEMP->BUS", "BUS->Rd"], 0, 0b0000], // E
  [0b0101, ["Rs->BUS", "BUS->RR"], 0, 0b0011], // F
  [
    0b0110,
    ["PC-BUS", "BUS->LA", "TEMP->BUS", "1->C0", "ADD", "ALU->LT"],
    0,
    0b1010
  ], // G
  [0b1000, ["RR->BUS", "BUS->Rd"], 0, 0b0000], // J
  [0b1001, ["RD->BUS", "BUS->LA", "RR->BUS", "MUL", "ALU->LT"], 0, 0b1100], // I1
  [0b1010, ["RD->BUS", "BUS->LA", "RR->BUS", "ADD", "ALU->LT"], 0, 0b1101], // I2
  [0b1011, ["RD->BUS", "BUS->LA", "RR->BUS", "SUB", "ALU->LT"], 0, 0b1101], // I3
  [0b1100, ["LT->BUS", "BUS->Ra"], 0, 0b0000], // L1
  [0b1101, ["LT->BUS", "BUS->Rd"], 0, 0b0000], // L2
  [0b1110, ["LT->BUS", "BUS->PC"], 0, 0b0000] // K
];

export default mMemory;
