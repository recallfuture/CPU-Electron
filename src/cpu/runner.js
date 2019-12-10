/**
 * 微指令执行程序
 */
export default {
  A(cpu) {
    cpu.bus = cpu.pc;
    cpu.imar = cpu.bus;
    cpu.alu.la = 0;
    cpu.alu.c0 = 1;
    cpu.alu.add();
  },
  B(cpu) {
    cpu.bus = cpu.alu.lt;
    cpu.pc = cpu.bus;
    cpu.imdr = cpu.iMemory.readShort(cpu.imar);
  },
  C(cpu) {
    cpu.bus = cpu.imdr;
    cpu.ir = cpu.bus;
  },
  D(cpu) {
    cpu.bus = cpu.pc;
    cpu.alu.la = cpu.bus;
  },
  E(cpu) {
    cpu.bus = cpu.temp;
    cpu.register.set(cpu.Rd, cpu.bus & 0xff);
  },
  F(cpu) {
    cpu.bus = cpu.register.get(cpu.Rr);
    cpu.rr = cpu.bus;
  },
  G(cpu) {
    cpu.bus = cpu.temp;
    cpu.alu.c0 = 1;
    cpu.alu.add();
  },
  H(cpu) {
    cpu.bus = cpu.register.get(cpu.Rd);
    cpu.rd = cpu.bus;
  },
  J(cpu) {
    cpu.bus = cpu.rr;
    cpu.register.set(cpu.Rd, cpu.bus & 0xff);
  },
  K(cpu) {
    cpu.bus = cpu.alu.lt;
    cpu.pc = cpu.bus;
  },
  M(cpu) {
    cpu.bus = cpu.rd;
    cpu.alu.la = cpu.bus;
  },
  I1(cpu) {
    cpu.bus = cpu.rr;
    cpu.alu.mul();
  },
  I2(cpu) {
    cpu.bus = cpu.rr;
    cpu.alu.add();
  },
  I3(cpu) {
    cpu.bus = cpu.rr;
    cpu.alu.sub();
  },
  L1(cpu) {
    cpu.bus = cpu.alu.lt;
    cpu.register.set("R0", cpu.bus & 0xff);
    cpu.register.set("R1", (cpu.bus >> 8) & 0xff);
  },
  L2(cpu) {
    cpu.bus = cpu.alu.lt;
    cpu.register.set(cpu.Rd, cpu.bus & 0xff);
  },
  Z() {}
};
