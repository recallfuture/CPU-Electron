import Constant from "./constant";

const decode = [];

decode[Constant.OP.ADD] = function(rd, rr) {
  // 直接使用!来判定的话会导致0也判定失败
  if (
    Constant.REGISTERS.indexOf(rd) === -1 ||
    Constant.REGISTERS.indexOf(rr) === -1
  ) {
    throw new Error("寄存器名错误！");
  }
  return Constant.OP.ADD + (Constant[rd] << 4) + Constant[rr];
};

decode[Constant.OP.SUB] = function(rd, rr) {
  if (
    Constant.REGISTERS.indexOf(rd) === -1 ||
    Constant.REGISTERS.indexOf(rr) === -1
  ) {
    throw new Error("寄存器名错误！");
  }
  return Constant.OP.SUB + (Constant[rd] << 4) + Constant[rr];
};

decode[Constant.OP.MUL] = function(rd, rr) {
  if (
    Constant.REGISTERS.indexOf(rd) === -1 ||
    Constant.REGISTERS.indexOf(rr) === -1
  ) {
    throw new Error("寄存器名错误！");
  }
  return Constant.OP.MUL + (Constant[rd] << 4) + Constant[rr];
};

decode[Constant.OP.RJUMP] = function(k) {
  let kNum = parseInt(k, 16);
  kNum = kNum ? kNum & 0xfff : 0;
  return Constant.OP.RJUMP + kNum;
};

decode[Constant.OP.BRMI] = function(k) {
  let kNum = parseInt(k, 16);
  kNum = kNum ? kNum & 0xff : 0;
  return Constant.OP.BRMI + kNum;
};

decode[Constant.OP.MOV] = function(rd, rr) {
  if (
    Constant.REGISTERS.indexOf(rd) === -1 ||
    Constant.REGISTERS.indexOf(rr) === -1
  ) {
    throw new Error("寄存器名错误！");
  }
  return Constant.OP.MOV + (Constant[rd] << 4) + Constant[rr];
};

decode[Constant.OP.LDI] = function(rd, k) {
  if (
    Constant.REGISTERS.indexOf(rd) === -1 ||
    Constant[rd] < 8 ||
    Constant[rd] > 15
  ) {
    throw new Error("寄存器名错误！目的寄存器只能是R8-R15");
  }
  let kNum = parseInt(k, 16);
  kNum = kNum ? kNum & 0xff : 0;
  return (
    Constant.OP.LDI + ((kNum & 0xf0) << 4) + (Constant[rd] << 4) + (kNum & 0xf)
  );
};

decode[Constant.OP.LD] = function(rd) {
  if (Constant.REGISTERS.indexOf(rd) === -1) {
    throw new Error("寄存器名错误！");
  }
  return Constant.OP.LD + (Constant[rd] << 4);
};

decode[Constant.OP.ST] = function(_, rr) {
  if (Constant.REGISTERS.indexOf(rr) === -1) {
    throw new Error("寄存器名错误！");
  }
  return Constant.OP.ST + (Constant[rr] << 4);
};

decode[Constant.OP.NOP] = function() {
  return 0;
};

/**
 * 解析汇编指令，返回解析好的二进制数据
 * @param {string} str 汇编指令
 */
export default function parser(str) {
  const s = str.trim().toUpperCase();
  // 匹配指令格式并获取分组
  const reg = /(\w+)( +(\w+)(, *(\w+))?)?/;
  const result = reg.exec(s);

  if (!result) {
    throw new Error("无效的指令格式");
  }

  const op = result[1];
  const k1 = result[3];
  const k2 = result[5];

  if (Object.keys(Constant.OP).indexOf(op) === -1) {
    throw new Error("无效的指令");
  }

  return decode[Constant.OP[op]](k1, k2);
}
