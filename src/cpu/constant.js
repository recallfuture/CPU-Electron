/**
 * 常量表
 */
export default {
  OP: {
    ADD: 0x0c00,
    SUB: 0x0800,
    MUL: 0x9c00,
    RJUMP: 0xc000,
    BRMI: 0xf100,
    MOV: 0x2c00,
    LDI: 0xe000,
    LD: 0x900c,
    ST: 0x920c,
    NOP: 0
  },

  REGISTERS: [
    "R0",
    "R1",
    "R2",
    "R3",
    "R4",
    "R5",
    "R6",
    "R7",
    "R8",
    "R9",
    "R10",
    "R11",
    "R12",
    "R13",
    "R14",
    "R15"
  ],

  // 通用寄存器
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 0xa,
  R11: 0xb,
  R12: 0xc,
  R13: 0xd,
  R14: 0xe,
  R15: 0xf,

  // 状态位
  F_CF: 0x1,
  F_ZF: 0x2,
  F_NF: 0x4,
  F_VF: 0x8,
  F_SF: 0x10,
  F_HF: 0x20,
  F_TF: 0x40,
  F_IF: 0x80,

  // 机器周期
  FT: 0,
  ST: 1,
  DT: 2,
  ET: 3,

  // 微指令
  M_INSTRUCTION: {
    A: "PC->BUS, BUS->IMAR, READ, CLEAR LA, 1->C0, ADD, ALU->LT",
    B: "LT->BUS, BUS->PC, WAIT",
    C: "IMDR->BUS, BUS->IR",
    D: "PC-BUS, BUS->LA",
    E: "TEMP->BUS, BUS->Rd",
    F: "Rs->BUS, BUS->RR",
    G: "TEMP->BUS, 1->C0, ADD, ALU->LT",
    H: "Rd->BUS, BUS->RD",
    M: "RD->BUS, BUS->LA",
    I1: "RR->BUS, MUL, ALU->LT",
    I2: "RR->BUS, ADD, ALU->LT",
    I3: "RR->BUS, SUB, ALU->LT",
    L1: "LT->BUS, BUS->Ra",
    L2: "LT->BUS, BUS->Rd",
    J: "RR->BUS, BUS->Rd",
    K: "LT->BUS, BUS->PC"
  },

  // 微程序
  // FT阶段都是A,B,C
  M_PROGRAM: {
    ADD: {
      ST: ["F"],
      DT: ["H"],
      ET: ["M", "I2", "L2"]
    },
    SUB: {
      ST: ["F"],
      DT: ["H"],
      ET: ["M", "I3", "L2"]
    },
    MUL: {
      ST: ["F"],
      DT: ["H"],
      ET: ["M", "I1", "L1"]
    },
    RJMP: {
      ET: ["D", "G", "K"]
    },
    BRMI: {
      ET: ["K", "K"]
    },
    MOV: {
      ST: ["F"],
      ET: ["J"]
    },
    LDI: {
      ET: ["E", "J"]
    },
    LD: {
      ST: ["F"],
      ET: ["J"]
    },
    ST: {
      ST: ["F"],
      ET: ["J"]
    },
    NOP: {}
  }
};

/**
 * 将对象转化为枚举，即可以用key找到value，也可以用value找到key
 * @param {Object} object 要转化的对象
 */
// function toEnum(object) {
//   for (const key in object) {
//     const element = object[key];
//     object[element] = key;
//   }
//   return object;
// }
