<template>
  <div id="app" class="board top-line">
    <div>
      <!-- 控制面板 -->
      <control-container
        @run="run"
        @step="step"
        @reset="reset"
      ></control-container>

      <!-- 主区域-->
      <div class="flex-container justify-center top-line flex-grow">
        <!-- 状态寄存器 -->
        <register-container
          left
          :title="'状态位'"
          :list="sr"
        ></register-container>

        <!-- 普通寄存器 -->
        <register-container
          left
          :title="'寄存器'"
          :list="registerLeft"
        ></register-container>

        <!-- 汇编代码 -->
        <code-container
          @change="changeFile"
          :pc="cpu.currentInstructionIndex"
          :data="lines"
        ></code-container>

        <!-- 通用寄存器 -->
        <register-container
          right
          :title="'通用寄存器'"
          :list="registerRight"
        ></register-container>
      </div>
    </div>
  </div>
</template>

<script>
import { formatNum } from "./utils";
import { Cpu, Constant, parser } from "./cpu";
import ControlContainer from "./components/ControlContainer";
import RegisterContainer from "./components/RegisterContainer";
import CodeContainer from "./components/CodeContainer";

export default {
  name: "app",
  data() {
    return {
      halt: true,
      cpu: new Cpu(),

      file: undefined,
      code: []
    };
  },
  components: {
    ControlContainer,
    RegisterContainer,
    CodeContainer
  },
  computed: {
    constant() {
      return Constant;
    },
    registerLeft() {
      return [
        { name: "PC", value: formatNum(this.cpu.pc, 16, 4) },
        { name: "BUS", value: formatNum(this.cpu.bus, 16, 4) },
        { name: "IR", value: formatNum(this.cpu.ir, 16, 4) },
        { name: "RR", value: formatNum(this.cpu.rr, 16, 2) },
        { name: "RD", value: formatNum(this.cpu.rd, 16, 2) },
        { name: "TEMP", value: formatNum(this.cpu.temp, 16, 2) },
        { name: "LA", value: formatNum(this.cpu.alu.la, 16, 2) },
        { name: "LT", value: formatNum(this.cpu.alu.lt, 16, 4) }
      ];
    },
    registerRight() {
      return Constant.REGISTERS.map(item => ({
        name: item,
        value: formatNum(this.cpu.register.get(item), 16, 2)
      }));
    },
    sr() {
      return [
        { name: "ZF", value: this.cpu.sr & Constant.F_ZF ? 1 : 0 },
        { name: "NF", value: this.cpu.sr & Constant.F_NF ? 1 : 0 },
        { name: "CF", value: this.cpu.sr & Constant.F_CF ? 1 : 0 },
        { name: "VF", value: this.cpu.sr & Constant.F_VF ? 1 : 0 },
        { name: "SF", value: this.cpu.sr & Constant.F_SF ? 1 : 0 },
        { name: "HF", value: this.cpu.sr & Constant.F_HF ? 1 : 0 },
        { name: "TF", value: this.cpu.sr & Constant.F_TF ? 1 : 0 },
        { name: "IF", value: this.cpu.sr & Constant.F_IF ? 1 : 0 }
      ];
    },

    lines() {
      return this.code.map((c, index) => ({
        addr: formatNum(index, 16, 4),
        code: c,
        instruction: formatNum(this.cpu.iMemory.readShort(index), 16, 4)
      }));
    }
  },
  methods: {
    run() {},

    step() {
      if (this.halt) {
        return;
      }
      this.cpu.step();
    },

    reset() {
      this.cpu = new Cpu();
      this.parse();
    },

    test() {
      // return Constant.M_PROGRAM.ALL.FT[this.cpu.currentMInstructionIndex];
    },

    changeFile(event) {
      //获取读取我文件的File对象
      const selectedFile = event.target.files[0];
      this.file = selectedFile;
      this.readFile(selectedFile);
    },

    readFile(file) {
      //这是核心,读取操作就是由它完成.
      const reader = new FileReader();

      //读取文件的内容,也可以读取文件的URL
      reader.readAsText(file);
      reader.onload = () => {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        this.code = reader.result.split("\n");
        this.code.pop();
        this.parse();
        this.halt = false;
      };
    },

    parse() {
      let index;
      try {
        for (index = 0; index < this.code.length; index++) {
          const item = this.code[index];
          if (!item) continue;

          // console.log(this.formatNum(parser(item), 16, 4));
          const instruction = parser(item);
          this.cpu.iMemory.writeShort(index, instruction);
        }
      } catch (e) {
        alert(
          `读取失败\n` +
            `${index + 1}:${this.code[index]}\n` +
            `原因是：${e.message}`
        );
      }
    }
  }
};
</script>

<style lang="stylus"></style>
