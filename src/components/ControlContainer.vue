<template>
  <div class="flex-container justify-center rot-top">
    <div class="control-container">
      <div>
        <button @click="$emit('run')">全部执行</button>
        <button @click="$emit('step')">单步执行</button>
        <button @click="$emit('reset')">重置</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlContainer"
};
</script>

<style lang="stylus"></style>
