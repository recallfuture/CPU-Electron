<template>
  <div id="app">
    <button @click="step">step</button>

    <p>pc: 0x{{ formatNum(cpu.pc, 16, 4) }}</p>
    <p>bus: 0x{{ formatNum(cpu.bus, 16, 4) }}</p>
    <p>ir: 0x{{ formatNum(cpu.ir, 16, 4) }}</p>

    <p>
      状态位:
      <label v-for="(f, index) in sr" :key="index" class="register-lable">
        {{ f.name }}: {{ f.value }}
      </label>
    </p>

    <p>
      寄存器:
      <label
        v-for="(r, index) in constant.REGISTERS"
        :key="index"
        class="register-lable"
      >
        {{ r }}: {{ formatNum(cpu.register.get(r), 16, 2) }}
      </label>
    </p>

    <label>
      指令存储器:
      <p
        v-for="(data, index) in cpu.iMemory.data"
        :key="index"
        class="register-lable"
      >
        0x{{ formatNum(index * 4, 16, 4) }}:
        <label v-for="(byte, index) in data" :key="index">
          {{ formatNum(byte, 2, 4) }}
        </label>
        {{ instruction[index] }}
      </p>
    </label>
  </div>
</template>

<script>
import { Cpu, Constant } from "./cpu";

export default {
  name: "app",
  data() {
    return {
      cpu: new Cpu(),
      instruction: [
        "LDI R8, 2C",
        "LDI R9, 30",
        "MOV R3, R8",
        "ADD R0, R9",
        "SUB R1, R8",
        "MUL R3, R8"
      ]
    };
  },
  computed: {
    constant() {
      return Constant;
    },
    sr() {
      return [
        { name: "ZF", value: this.cpu.alu.sr & Constant.F_ZF ? 1 : 0 },
        { name: "NF", value: this.cpu.alu.sr & Constant.F_NF ? 1 : 0 },
        { name: "CF", value: this.cpu.alu.sr & Constant.F_CF ? 1 : 0 },
        { name: "VF", value: this.cpu.alu.sr & Constant.F_VF ? 1 : 0 },
        { name: "SF", value: this.cpu.alu.sr & Constant.F_SF ? 1 : 0 },
        { name: "HF", value: this.cpu.alu.sr & Constant.F_HF ? 1 : 0 },
        { name: "TF", value: this.cpu.alu.sr & Constant.F_TF ? 1 : 0 },
        { name: "IF", value: this.cpu.alu.sr & Constant.F_IF ? 1 : 0 }
      ];
    }
  },
  created() {
    // LDI
    this.cpu.iMemory.writeInt(0, 0xe28c);
    this.cpu.iMemory.writeInt(4, 0xe294);
    this.cpu.iMemory.writeInt(8, 0x2c38);
    this.cpu.iMemory.writeInt(12, 0x0c89);
    this.cpu.iMemory.writeInt(16, 0x0818);
    this.cpu.iMemory.writeInt(20, 0x9c38);
  },
  methods: {
    step() {
      this.cpu.step();
    },

    formatNum(num, bit = 10, length = 0) {
      if (typeof num === "undefined") {
        console.warn(`格式化失败：${num}`);
        return 0;
      }

      let result = num.toString(bit);
      while (result.length < length) {
        result = "0" + result;
      }
      return result;
    }
  }
};
</script>

<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.register-lable {
  background-color: #999;
  margin-right: 5px;
  padding: 5px;
  border-radius: 5px;
}
</style>
