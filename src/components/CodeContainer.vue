<template>
  <div class="code-container flex-grow container container-line top-dotted">
    <h2 class="active"><span class="tab"></span>指令存储器</h2>
    <h2>
      <span class="tab"></span
      ><input type="file" @change="$emit('change', $event)" />选择文件
    </h2>
    <div style="height: 100%; display: flex;">
      <pre>
        <code>
          <div class="code-line-indicator" v-show="data.length > 0" :style="{top: pc * 1.2 + 'em'}"></div>
          <div class="code-line" v-for="(item, index) in data" :key="index"><span class="line-number">0x{{ item.addr }}</span><span>  {{ item.instruction }}   |  {{ item.code }}</span></div>
        </code>
      </pre>
      <pre>
        <code>
          <div class="code-line-indicator" v-show="mData.length > 0" :style="{top: (mData.length-1) * 1.2 + 'em'}"></div>
          <div class="code-line" v-for="(item, index) in mData" :key="index"><span class="line-number" :class="cycleClass(item.cycle)">{{ item.cycle }}</span><span>  {{ item.mInstruction }}  </span></div>
        </code>
      </pre>
    </div>
  </div>
</template>

<script>
export default {
  name: "CodeContainer",
  props: {
    pc: {
      type: Number
    },
    data: {
      type: Array,
      default: () => []
    },
    mData: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    cycleClass(cycle) {
      return {
        FT: cycle === "FT",
        ST: cycle === "ST",
        DT: cycle === "DT",
        ET: cycle === "ET"
      };
    }
  }
};
</script>

<style lang="stylus">
.code-line > span {
  &.FT {
    background-color: #002b2d;
  }

  &.ST {
    background-color: #1F0A18;
  }

  &.DT {
    background-color: #21220B;
  }

  &.ET {
    background-color: #392513;
  }
}
</style>
