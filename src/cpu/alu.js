import Constant from "./constant";

export default class Alu {
  constructor() {
    this.la = 0; // 8位
    this.lb = 0; // 8位
    this.lt = 0; // 16位，乘法需要

    this.sr = 0; // 8位
  }

  /**
   * 相加
   */
  add() {
    this.lt = this.la + this.lb;
    this.sr =
      this.zFlag() |
      this.nFlag() |
      this.cFlag() |
      this.vFlag() |
      this.sFlag() |
      this.hFlag();
    this.lt &= 0xffff;
  }

  /**
   * 相减
   */
  sub() {
    // 先求-lb，然后按照加法计算
    this.temp = ((this.lb ^ 0xff) + 1) & 0xff;
    this.lt = this.la + this.temp;
    this.sr =
      this.zFlag() |
      this.nFlag() |
      this.cFlag() |
      this.vFlag() |
      this.sFlag() |
      this.hFlag();
    this.lt &= 0xffff;
  }

  /**
   * 无符号相乘
   */
  mul() {
    this.lt = this.la + this.lb;
    this.sr = this.zFlag() | this.cFlag();
    this.lt &= 0xffff;
  }

  // 0标志位，如果结果为0则置1
  zFlag() {
    if (this.lt === 0) {
      return Constant.F_ZF;
    }
    return 0;
  }

  // 负数标志位，如果结果为负数则置1
  nFlag() {
    if (this.lt > 127) {
      return Constant.F_NF;
    }
    return 0;
  }

  // 无符号数溢出标志位
  cFlag() {
    if (this.lt > 255) {
      return Constant.F_CF;
    }
    return 0;
  }

  // 有符号数益溢出标志位
  vFlag() {
    let cond = 0;
    cond += this.la + this.lb;
    cond += -(this.la > 127 ? 256 : 0) - (this.lb > 127 ? 256 : 0);
    if (cond < 0 || cond > 255) {
      return Constant.F_VF;
    }
    return 0;
  }

  // 符号标志位
  sFlag(n, v) {
    return (n > 0 && v > 0) || (n === 0 && v === 0) ? 0 : Constant.F_SF;
  }

  hFlag() {
    // TODO: 编写逻辑
    return 0;
  }
}
