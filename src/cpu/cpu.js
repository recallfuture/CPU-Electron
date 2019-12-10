// import Constant from "./constant";
import Memory from "./memory";
import Register from "./register";
import Alu from "./alu";
import Constant from "./constant";
import runner from "./runner";

export default class Cpu {
  constructor() {
    // 程序计数器
    this.pc = 0;
    // 总线
    this.bus = 0;
    // 指令寄存器
    this.ir = 0;
    // 源操作数、目的操作数、临时寄存器
    this.rr = 0;
    this.rd = 0;
    this.temp = 0;

    // 状态寄存器
    this.sr = 0;

    // 通用寄存器
    this.register = new Register();
    // 计算模块
    this.alu = new Alu(this);
    // 指令存储器和微指令存储器
    this.iMemory = new Memory();
    // 指令存储器的地址寄存器和数据寄存器
    this.imar = 0;
    this.imdr = 0;

    // 源寄存器号和目的寄存器号
    this.Rr = 0;
    this.Rd = 0;

    // 当前执行的指令
    this.currentInstruction = "NOP";
    this.currentInstructionIndex = 0;

    // 指令周期
    this.cycle = ["FT", "ST", "DT", "ET"];
    this.currentCycleIndex = 0;
    // 当前指令周期的微指令索引
    this.currentMInstructionIndex = 0;
  }

  /**
   * 检查当前指令
   * @param {*} op 指令的二进制码
   */
  check(op) {
    let i = this.ir;
    let o = op;
    // 分四组判定，每组判定四位
    for (let index = 4; index > 0; index--) {
      // 如果op最后一组不为0
      // 处于第一组时必须判定
      if ((o & 0xf) > 0 || index === 1) {
        // 如果ir和op最后四位不相等，则返回失败
        if ((i & 0xf) !== (o & 0xf)) return false;
      }
      // 全部右移
      i >>= 4;
      o >>= 4;
    }
    return true;
  }

  /**
   * 获取下一个机器周期的索引
   */
  getNextCycleIndex() {
    for (
      let index = this.currentCycleIndex + 1;
      index < this.cycle.length;
      index++
    ) {
      if (Constant.M_PROGRAM[this.currentInstruction][this.cycle[index]]) {
        return index;
      }
    }
    this.currentInstructionIndex = this.pc;
    return 0;
  }

  /**
   * 获取当前微程序
   */
  getCurrentMProgram() {
    const currentCycle = this.cycle[this.currentCycleIndex];
    if (currentCycle === "FT") {
      return Constant.M_PROGRAM.ALL;
    } else {
      return Constant.M_PROGRAM[this.currentInstruction];
    }
  }

  /**
   * 获取当前将要执行的微指令
   */
  getCurrentMInstruction() {
    const currentCycle = this.cycle[this.currentCycleIndex];
    const currentMProgram = this.getCurrentMProgram();

    return currentMProgram[currentCycle][this.currentMInstructionIndex];
  }

  /**
   * 获取下次将要执行的微指令
   */
  getNextMInstruction() {
    const currentCycle = this.cycle[this.currentCycleIndex];
    const currentMProgram = this.getCurrentMProgram();
    return currentMProgram[currentCycle][this.currentMInstructionIndex + 1];
  }

  // 单步执行，最小步骤为一条微指令
  step() {
    // 复位alu的c0
    this.alu.c0 = 0;

    // 取出当前的微指令
    const currentMInstruction = this.getCurrentMInstruction();
    // 取出下一条微指令
    const nextMInstruction = this.getNextMInstruction();

    // 执行当前的微指令
    if (currentMInstruction) {
      runner[currentMInstruction](this);
      if (nextMInstruction) {
        this.currentMInstructionIndex++;
        return;
      }
    }

    if (this.cycle[this.currentCycleIndex] === "FT") {
      // 译码
      this.currentInstruction = "NOP";
      for (const key in Constant.OP) {
        if (this.check(Constant.OP[key])) {
          this.currentInstruction = key;
          break;
        }
      }

      if (
        this.currentInstruction === "ADD" ||
        this.currentInstruction === "SUB" ||
        this.currentInstruction === "MUL" ||
        this.currentInstruction === "MOV"
      ) {
        this.Rd = (this.ir >> 4) & 0xf;
        this.Rr = this.ir & 0xf;
      }

      if (this.currentInstruction === "RJMP") {
        this.temp = this.ir & 0xfff;
      }

      if (this.currentInstruction === "BRMI") {
        this.temp = this.ir & 0xff;
        if (!(this.sr & Constant.F_NF)) {
          this.currentInstructionIndex = this.pc;
          this.currentMInstructionIndex = 0;
          this.currentCycleIndex = 0;
        }
      }

      if (this.currentInstruction === "LDI") {
        this.temp = ((this.ir & 0xf00) >> 4) + (this.ir & 0xf);
        this.Rd = (this.ir >> 4) & 0xf;
      }

      if (this.currentInstruction === "LD") {
        this.Rd = (this.ir >> 4) & 0xf;
        this.Rr = 14;
      }

      if (this.currentInstruction === "ST") {
        this.Rd = 14;
        this.Rr = (this.ir >> 4) & 0xf;
      }
    }

    this.currentMInstructionIndex = 0;
    this.currentCycleIndex = this.getNextCycleIndex();
  }
}
