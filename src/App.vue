<template>
  <div id="app">
    <input type="file" name="file" id="file" @change="readFile" />
    <br />
    <button @click="step">单步执行</button>

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
        {{ formatNum(cpu.iMemory.readInt(index * 4), 16, 4) }}
        {{ instruction[index] }}
      </p>
    </label>
  </div>
</template>

<script>
import { Cpu, Constant, parser } from "./cpu";

export default {
  name: "app",
  data() {
    return {
      cpu: new Cpu(),
      instruction: []
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
    // this.cpu.iMemory.writeInt(0, 0xe28c);
    // this.cpu.iMemory.writeInt(4, 0xe294);
    // this.cpu.iMemory.writeInt(8, 0x2c38);
    // this.cpu.iMemory.writeInt(12, 0x0c89);
    // this.cpu.iMemory.writeInt(16, 0x0818);
    // this.cpu.iMemory.writeInt(20, 0x9c38);
  },
  methods: {
    step() {
      this.cpu.step();
    },

    readFile(event) {
      const callback = this.parse;
      //获取读取我文件的File对象
      const selectedFile = event.target.files[0];
      //这是核心,读取操作就是由它完成.
      const reader = new FileReader();

      //读取文件的内容,也可以读取文件的URL
      reader.readAsText(selectedFile);
      reader.onload = function() {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        callback(this.result);
      };
    },

    parse(text) {
      this.instruction = text.split("\n");

      let index;
      try {
        for (index = 0; index < this.instruction.length; index++) {
          const item = this.instruction[index];
          if (!item) continue;

          // console.log(this.formatNum(parser(item), 16, 4));
          this.cpu.iMemory.writeInt(index * 4, parser(item));
        }
      } catch (e) {
        alert(
          `读取失败\n` +
            `${index + 1}:${this.instruction[index]}\n` +
            `原因是：${e.message}`
        );
      }
    },

    formatNum(num, bit = 10, length = 0) {
      let result;

      if (typeof num === "undefined") {
        console.warn(`格式化失败：${num}`);
        result = "0";
      } else {
        result = num.toString(bit);
      }

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
