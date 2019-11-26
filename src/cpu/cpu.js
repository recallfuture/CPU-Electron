// import Constant from "./constant";
import Memory from "./memory";
import Register from "./register";
import Alu from "./alu";
import Constant from "./constant";

export default class Cpu {
  constructor() {
    // 程序计数器
    this.pc = 0;
    // 总线
    this.bus = 0;
    // 指令寄存器
    this.ir = 0;
    // 通用寄存器
    this.register = new Register();
    // 计算模块
    this.alu = new Alu();

    // 源操作数、目的操作数、临时寄存器
    this.rr = 0;
    this.rd = 0;
    this.temp = 0;

    // 指令存储器和数据存储器
    this.iMemory = new Memory();
    this.memory = new Memory();

    // 指令存储器的地址寄存器和数据寄存器
    this.imar = 0;
    this.imdr = 0;

    // 数据存储器的地址寄存器和数据寄存器
    this.mar = 0;
    this.mdr = 0;
  }

  step() {
    // FT
    // pc->bus, bus->imar, read, imdr->bus, bus->ir, pc+1->pc
    this.ir = this.iMemory.readInt(this.pc);
    this.pc += 4;

    /**
     * 检查当前指令
     * @param {*} op 指令
     */
    const check = op => {
      let i = this.ir;
      let o = op;
      // 分四组判定，每组判定四位
      for (let index = 0; index < 4; index++) {
        // 如果op最后四位不为0
        // 为0意味着这四位不是op位，跳过
        if ((o & 0xf) > 0) {
          // 如果ir和op最后四位不相等，则返回失败
          if ((i & 0xf) !== (o & 0xf)) return false;
        }
        // 全部右移
        i >>= 4;
        o >>= 4;
      }
      return true;
    };

    // 译码
    if (check(Constant.OP.ADD)) {
      // ADD指令
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.rr = this.register.get(rr);
      this.rd = this.register.get(rd);

      this.alu.la = this.rd;
      this.alu.lb = this.rr;

      this.alu.add();

      this.register.set(rd, this.alu.lt & 0xff);
    } else if (check(Constant.OP.SUB)) {
      // SUB指令
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.rr = this.register.get(rr);
      this.rd = this.register.get(rd);

      this.alu.la = this.rd;
      this.alu.lb = this.rr;

      this.alu.sub();

      this.register.set(rd, this.alu.lt & 0xff);
    } else if (check(Constant.OP.MUL)) {
      // MUL指令
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.rr = this.register.get(rr);
      this.rd = this.register.get(rd);

      this.alu.la = this.rd;
      this.alu.lb = this.rr;

      this.alu.mul();

      this.register.set(0, this.alu.lt & 0xff);
      this.register.set(1, (this.alu.lt >> 4) & 0xff);
    } else if (check(Constant.OP.RJUMP)) {
      // RJUMP
      const k = this.ir & 0xfff;
      this.pc += k + 1;
    } else if (check(Constant.OP.BRMI)) {
      // BRMI
      const k = this.ir & 0xff;
      if (this.alu.sr & Constant.F_NF) {
        this.pc += k + 1;
      }
    } else if (check(Constant.OP.MOV)) {
      // MOV
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.register.set(rd, this.register.get(rr));
    } else if (check(Constant.OP.LDI)) {
      // LDI
      const k = ((this.ir & 0xf00) >> 4) + (this.ir & 0xf);
      const rd = (this.ir >> 4) & 0xf;

      // rd只能是8-15
      if (rd > 7 && rd < 16) {
        this.register.set(rd, k);
      }
    } else if (check(Constant.OP.LD)) {
      // LD
      const rd = (this.ir >> 4) & 0xf;
      this.register.set(rd, this.register.get(14));
    } else if (check(Constant.OP.ST)) {
      // ST
      const rr = (this.ir >> 4) & 0xf;
      this.register.set(14, this.register.get(rr));
    } else if (check(Constant.OP.NOP)) {
      // NOP
    }
  }
}
