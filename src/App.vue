<template>
  <div id="app" class="board top-line">
    <div>
      <!-- 控制面板 -->
      <control-container
        :autostep="!!auto"
        @run="run"
        @stop="stop"
        @step="step"
        @reset="reset"
      ></control-container>

      <!-- 主区域-->
      <div class="flex-container justify-center top-line flex-grow">
        <!-- 状态寄存器 -->
        <register-container
          left
          :title="'状态位'"
          :items="sr"
        ></register-container>

        <!-- 普通寄存器 -->
        <register-container
          left
          :title="'寄存器'"
          :items="registerLeft"
        ></register-container>

        <!-- 汇编代码 -->
        <code-container
          @change="changeFile"
          :instructionIndex="cpu.currentInstructionIndex"
          :instructions="instructions"
          :mInstructions="mInstructions"
        ></code-container>

        <!-- 通用寄存器 -->
        <register-container
          right
          :title="'通用寄存器'"
          :items="registerRight"
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
      cpu: new Cpu(),

      fileContent: "",
      instructions: [],
      mInstructions: [],

      auto: null
    };
  },
  components: {
    ControlContainer,
    RegisterContainer,
    CodeContainer
  },
  computed: {
    registerLeft() {
      return [
        { name: "PC", value: formatNum(this.cpu.pc, 16, 4) },
        { name: "BUS", value: formatNum(this.cpu.bus, 16, 4) },
        { name: "IR", value: formatNum(this.cpu.ir, 16, 4) },
        { name: "RR", value: formatNum(this.cpu.rr, 16, 2) },
        { name: "RD", value: formatNum(this.cpu.rd, 16, 2) },
        { name: "TEMP", value: formatNum(this.cpu.temp, 16, 4) },
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
    }
  },
  methods: {
    run() {
      this.auto = setInterval(() => {
        if (!this.step()) {
          this.stop();
        }
      }, 100);
    },

    stop() {
      if (this.auto) {
        clearInterval(this.auto);
        this.auto = null;
      }
    },

    step() {
      if (this.cpu.currentInstructionIndex >= this.instructions.length) {
        return false;
      }

      this.mInstructions.push({
        cycle: this.cpu.cycle[this.cpu.currentCycleIndex],
        code: Constant.M_INSTRUCTION[this.cpu.getCurrentMInstruction()]
      });

      this.cpu.step();
      return true;
    },

    reset() {
      this.stop();
      this.cpu = new Cpu();
      this.mInstructions = [];
      this.parse();
    },

    changeFile(event) {
      //获取读取我文件的File对象
      const selectedFile = event.target.files[0];
      this.readFile(selectedFile);
    },

    readFile(file) {
      const reader = new FileReader();

      //读取文件的内容,也可以读取文件的URL
      reader.readAsText(file);
      reader.onload = () => {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        this.fileContent = reader.result;
        this.parse();
      };
    },

    // 解析汇编
    parse() {
      if (!this.fileContent) {
        return;
      }

      // 按行分割
      const lines = this.fileContent.split("\n");
      // 清空
      this.instructions = [];

      for (let index = 0; index < lines.length; index++) {
        const code = lines[index];
        if (!code || !code.trim()) continue;

        try {
          const bCode = parser(code);
          this.cpu.iMemory.writeShort(index, bCode);
          this.instructions.push({
            code,
            bCode: formatNum(bCode, 16, 4)
          });
        } catch (e) {
          alert(
            `读取失败\n` +
              `第${index + 1}行:${lines[index]}\n` +
              `原因是：${e.message}`
          );
          break;
        }
      }
    }
  }
};
</script>

<style lang="stylus">
@import url('assets/style/main.css');
@import url('assets/style/board.css');
@import url('assets/style/register.css');
@import url('assets/style/stack.css');
@import url('assets/style/clock.css');
@import url('assets/style/condition.css');
@import url('assets/style/control.css');
@import url('assets/style/cpi.css');
@import url('assets/style/code.css');
@import url('assets/style/pipe.css');
</style>
