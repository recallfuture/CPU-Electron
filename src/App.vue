<template>
  <div id="app" class="board top-line">
    <div>
      <!-- 控制面板 -->
      <control-container
        :autostep="!!auto"
        @run="run"
        @stop="stop"
        @previous="previous"
        @step="step"
        @reset="reset"
        @save="save"
      ></control-container>

      <!-- 主区域-->
      <div class="flex-container justify-center top-line flex-grow">
        <!-- 状态寄存器 -->
        <register-container
          left
          :title="'状态位'"
          :items="sr"
        ></register-container>

        <!-- 汇编代码 -->
        <code-container
          @change="changeFile"
          :instructionIndex="cpu.currentInstructionIndex"
          :instructions="instructions"
          :mInstructions="mInstructions"
        ></code-container>

        <!-- 普通寄存器 -->
        <register-container
          right
          :title="'寄存器'"
          :items="registerLeft"
        ></register-container>
        <!-- 通用寄存器 -->
        <register-container
          right
          :title="'寄存器'"
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
import eventBus from "./event-bus";

import * as _ from "lodash";
import { saveAs } from "file-saver";

export default {
  name: "app",
  data() {
    return {
      cpu: this.createCpu(),

      fileContent: "",
      instructions: [],
      mInstructions: [],

      auto: null,
      history: []
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
        { name: "pc", value: formatNum(this.cpu.pc, 16, 4) },
        { name: "bus", value: formatNum(this.cpu.bus, 16, 4) },
        { name: "ir", value: formatNum(this.cpu.ir, 16, 4) },
        { name: "rr", value: formatNum(this.cpu.rr, 16, 2) },
        { name: "rd", value: formatNum(this.cpu.rd, 16, 2) },
        { name: "temp", value: formatNum(this.cpu.temp, 16, 4) },
        { name: "la", value: formatNum(this.cpu.alu.la, 16, 2) },
        { name: "lt", value: formatNum(this.cpu.alu.lt, 16, 4) }
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
        { name: "ZF", value: this.cpu.sr.ZF },
        { name: "NF", value: this.cpu.sr.NF },
        { name: "CF", value: this.cpu.sr.CF },
        { name: "VF", value: this.cpu.sr.VF },
        { name: "SF", value: this.cpu.sr.SF },
        { name: "HF", value: this.cpu.sr.HF },
        { name: "TF", value: this.cpu.sr.TF },
        { name: "IF", value: this.cpu.sr.IF }
      ];
    }
  },
  methods: {
    // 创建一个cpu，使用Proxy检测其中数据的变动并在变化时发送事件
    createCpu() {
      const cpu = new Cpu();
      const handler = {
        set(target, key, value, receiver) {
          if (
            ["pc", "bus", "ir", "rr", "rd", "temp", "la", "lt"].indexOf(key) !==
              -1 ||
            Constant.REGISTERS.indexOf(key) !== -1 ||
            ["ZF", "NF", "CF", "VF", "SF", "HF", "TF", "IF"].indexOf(key) !== -1
          ) {
            eventBus.$emit("register-change", {
              target,
              key,
              value,
              receiver
            });
          }

          return Reflect.set(target, key, value, receiver);
        }
      };

      cpu.register = new Proxy(cpu.register, handler);
      cpu.sr = new Proxy(cpu.sr, handler);
      return new Proxy(cpu, handler);
    },

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

    previous() {
      if (!this.history) {
        return;
      }

      const item = this.history.pop();
      this.cpu = item.cpu;
      this.mInstructions = item.mInstructions;
    },

    step() {
      if (this.cpu.currentInstructionIndex >= this.instructions.length) {
        return false;
      }

      this.history.push({
        cpu: _.cloneDeepWith(this.cpu),
        mInstructions: _.cloneDeepWith(this.mInstructions)
      });

      this.mInstructions.push({
        cycle: this.cpu.cycle[this.cpu.currentCycleIndex],
        code: Constant.M_INSTRUCTION[this.cpu.getCurrentMInstruction()]
      });

      this.cpu.step();
      return true;
    },

    clear() {
      // 清空
      this.cpu = this.createCpu();
      this.mInstructions = [];
      this.history = [];
    },

    reset() {
      this.stop();
      this.clear();

      // 重新写入指令
      for (let index = 0; index < this.instructions.length; index++) {
        this.cpu.iMemory.writeShort(index, this.instructions[index].bCode);
      }
    },

    save() {
      if (!this.instructions || this.instructions.length === 0) {
        alert("请先在【指令存储器】旁选择汇编文件");
        return;
      }

      let str = "\n";

      str += "指令存储器：\n";
      for (const i of this.instructions) {
        str += `${i.bCode}: ${i.code}\n`;
      }

      str += "\n微周期：\n";
      for (const h of this.history) {
        if (h.mInstructions.length === 0) {
          continue;
        }

        str += `\n当前指令：${
          this.instructions[h.cpu.currentInstructionIndex].code
        }\n`;
        str += `当前机器周期：${h.cpu.cycle[h.cpu.currentCycleIndex]}\n`;
        str += `当前微指令：${formatNum(
          h.mInstructions[h.mInstructions.length - 1].code,
          16,
          4
        )}\n`;

        str += `ZF：${h.cpu.sr & Constant.F_ZF ? 1 : 0}\n`;
        str += `NF：${h.cpu.sr & Constant.F_NF ? 1 : 0}\n`;
        str += `CF：${h.cpu.sr & Constant.F_CF ? 1 : 0}\n`;
        str += `VF：${h.cpu.sr & Constant.F_VF ? 1 : 0}\n`;
        str += `SF：${h.cpu.sr & Constant.F_SF ? 1 : 0}\n`;
        str += `HF：${h.cpu.sr & Constant.F_HF ? 1 : 0}\n`;
        str += `TF：${h.cpu.sr & Constant.F_TF ? 1 : 0}\n`;
        str += `IF：${h.cpu.sr & Constant.F_IF ? 1 : 0}\n`;

        str += `pc：0x${formatNum(h.cpu.pc, 16, 4)}\n`;
        str += `bus：0x${formatNum(h.cpu.bus, 16, 4)}\n`;
        str += `ir：0x${formatNum(h.cpu.ir, 16, 4)}\n`;
        str += `rr：0x${formatNum(h.cpu.rr, 16, 2)}\n`;
        str += `rd：0x${formatNum(h.cpu.rd, 16, 2)}\n`;
        str += `temp：0x${formatNum(h.cpu.temp, 16, 4)}\n`;
        str += `la：0x${formatNum(h.cpu.alu.la, 16, 2)}\n`;
        str += `lt：0x${formatNum(h.cpu.alu.lt, 16, 4)}\n`;

        Constant.REGISTERS.forEach(item => {
          str += `${item}：0x${formatNum(h.cpu.register.get(item), 16, 2)}\n`;
        });
      }

      var blob = new Blob([str], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, "output.txt");
    },

    changeFile(event) {
      this.clear();
      //获取读取我文件的File对象
      const selectedFile = event.target.files[0];
      this.readFile(selectedFile);
      event.target.value = "";
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
      this.instructions = [];

      for (let index = 0; index < lines.length; index++) {
        const code = lines[index];
        if (!code || !code.trim()) continue;

        try {
          const bCode = parser(code);
          this.cpu.iMemory.writeShort(index, bCode);
          this.instructions.push({
            code,
            bCode
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
