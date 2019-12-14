<template>
  <div style="height: 100%; display: flex;flex-grow: 1;">
    <div class="code-container flex-grow container container-line top-dotted">
      <h2 class="active"><span class="tab"></span>指令存储器</h2>
      <h2>
        <span class="tab"></span>
        <input type="file" @change="$emit('change', $event)" />选择文件
      </h2>
      <pre ref="instruction">
        <code>
          <div class="code-line-indicator" v-show="instructions.length > 0" :style="{top: instructionIndex * 1.2 + 'em'}"></div>
          <div class="code-line" v-for="(item, index) in instructions" :key="index"><span class="line-number">0x{{ formatNum(index, 16, 4) }}</span><span>  {{ item.bCode }}  |  {{ item.code }}</span></div>
        </code>
      </pre>
    </div>

    <div class="code-container flex-grow container container-line top-dotted">
      <h2 class="active"><span class="tab"></span>微指令</h2>
      <pre ref="mInstruction">
        <code>
          <div class="code-line-indicator" v-show="mInstructions.length > 0" :style="{top: (mInstructions.length-1) * 1.2 + 'em'}"></div>
          <div class="code-line" v-for="(item, index) in mInstructions" :key="index"><span class="line-number" :class="cycleClass(item.cycle)">{{ item.cycle }}</span><span>  {{ item.code }}  </span></div>
        </code>
      </pre>
    </div>
  </div>
</template>

<script>
import { formatNum } from "../utils";

export default {
  name: "CodeContainer",
  props: {
    // 当前指令执行的位置
    instructionIndex: {
      type: Number
    },

    // 所有指令
    // [
    //    { code: "", bCode:"" },
    // ]
    instructions: {
      type: Array,
      default: () => []
    },

    // 所有微指令
    // [
    //    { cycle: "", code: ""},
    // ]
    mInstructions: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    formatNum,

    cycleClass(cycle) {
      return {
        FT: cycle === "FT",
        ST: cycle === "ST",
        DT: cycle === "DT",
        ET: cycle === "ET"
      };
    }
  },

  watch: {
    instructionIndex() {
      // 自动滚动到光标位置
      // 超出上边界时直接跳转
      // 超出下边界时向下移动两行
      const div = this.$refs.instruction;
      const currentHeight = this.instructionIndex * 1.2 * 14;
      if (div.scrollTop > currentHeight) {
        div.scrollTop = currentHeight;
      } else if (div.scrollTop + div.clientHeight - 1.2 * 14 < currentHeight) {
        div.scrollTop = currentHeight - div.clientHeight + 2 * 1.2 * 14;
      }
    },

    mInstructions() {
      // 自动滚动到光标位置
      const div = this.$refs.mInstruction;
      div.scrollTop = (this.mInstructions.length - 1) * 1.2 * 14;
    }
  }
};
</script>

<style lang="stylus">
.code-line > span {
  &.FT {
    background-color: #002b2d !important;
  }

  &.ST {
    background-color: #392513 !important;
  }

  &.DT {
    background-color: #21220B !important;
  }

  &.ET {
    background-color: #1F0A18 !important;
  }
}
</style>
