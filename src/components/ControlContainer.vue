<template>
  <div class="flex-container justify-center rot-top">
    <div class="control-container">
      <div>
        <button v-show="!autostep" @click="$emit('run')">全部执行</button>
        <button v-show="autostep" @click="$emit('stop')">停止执行</button>
        <button @click="$emit('previous')">上一步</button>
        <button @click="$emit('step')">下一步</button>
        <button @click="$emit('reset')">重置</button>
        <button @click="$emit('save')">保存日志</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlContainer",

  props: {
    autostep: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="stylus"></style>
