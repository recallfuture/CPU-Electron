/**
 * 常量表
 */
export default {
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
  ET: 3
};
