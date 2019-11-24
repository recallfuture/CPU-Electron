// import Constant from "./constant";
import Memory from "./memory";
import Register from "./register";
import Alu from "./alu";
import constant from "./constant";

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
    this.sr = 0;
    this.dr = 0;
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

    // 译码
    // 获取高8位和高4位
    const h8 = this.ir >> 8;
    const h4 = this.ir >> 12;

    if (h8 === 0x0c) {
      // ADD指令
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.sr = this.register.get(rd);
      this.dr = this.register.get(rr);

      this.alu.la = this.sr;
      this.alu.lb = this.dr;

      this.alu.add();

      this.register.set(rd, this.alu.lt & 0xff);
    } else if (h8 === 0x08) {
      // SUB指令
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.sr = this.register.get(rd);
      this.dr = this.register.get(rr);

      this.alu.la = this.sr;
      this.alu.lb = this.dr;

      this.alu.sub();

      this.register.set(rd, this.alu.lt & 0xff);
    } else if (h8 === 0x9c) {
      // MUL指令
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.sr = this.register.get(rd);
      this.dr = this.register.get(rr);

      this.alu.la = this.sr;
      this.alu.lb = this.dr;

      this.alu.mul();

      this.register.set(0, this.alu.lt & 0xff);
      this.register.set(1, (this.alu.lt >> 4) & 0xff);
    } else if (h4 === 0xc) {
      // RJUMP
      const k = this.ir & 0xfff;
      this.pc += k + 1;
    } else if (h8 === 0xf1) {
      // BRMI
      const k = this.ir & 0xff;
      if (this.alu.sr & constant.F_NF) {
        this.pc += k + 1;
      }
    } else if (h8 === 0x2c) {
      // MOV
      const rd = (this.ir >> 4) & 0xf;
      const rr = this.ir & 0xf;

      this.register.set(rd, this.register.get(rr));
    } else if (h4 === 0xe) {
      // LDI
      const k = ((this.ir & 0xf00) >> 4) + (this.ir & 0xf);
      const rd = (this.ir >> 4) & 0xf;

      // rd只能是8-15
      if (rd > 7 && rd < 16) {
        this.register.set(rd, k);
      }
    } else if (h8 === 0x90) {
      // LD
      const rd = (this.ir >> 4) & 0xf;
      this.register.set(rd, this.register.get(14));
    } else if (h8 === 0x92) {
      // ST
      const rr = (this.ir >> 4) & 0xf;
      this.register.set(14, this.register.get(rr));
    } else if (h8 === 0x00) {
      // NOP
    }
  }
}
