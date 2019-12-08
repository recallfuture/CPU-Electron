<template>
  <div class="code-container flex-grow container container-line top-dotted">
    <h2 class="active"><span class="tab"></span>指令存储器</h2>
    <h2>
      <span class="tab"></span
      ><input type="file" @change="$emit('change', $event)" />选择文件
    </h2>
    <pre>
      <code>
        <div class="code-line-indicator" :style="{top: pc * 1.2 + 'em'}"></div>
        <div class="code-line" v-for="(item, index) in data" :key="index"><span class="line-number">0x{{ item.addr }}</span><span>  {{ item.instruction }}   |  {{ item.code }}</span></div>
      </code>
    </pre>
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
    }
  }
};
</script>

<style lang="stylus"></style>
