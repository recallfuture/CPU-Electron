<template>
  <div
    class="register-container container container-line container-left"
    :class="{ 'rot-left': left, 'rot-right': right }"
  >
    <h3>{{ title }}</h3>
    <div>
      <div
        v-for="(item, index) in items"
        :key="index"
        ref="registers"
        class="register"
      >
        <div class="register-name">{{ item.name }}</div>
        <div class="register-data">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatNum } from "../utils";
import * as move from "move-js";

export default {
  name: "RegisterContainer",
  props: {
    left: {
      type: Boolean
    },
    right: {
      type: Boolean
    },
    title: {
      type: String
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatNum,

    animate(index) {
      move(this.$refs.registers[index])
        .set("color", "#0B0B0B")
        .set("background-color", "#37F3FF")
        .duration("0s")
        .delay("0s")
        .then()
        .set("color", "#37F3FF")
        .set("background-color", "#0B0B0B")
        .duration(".2s")
        .delay(".1s")
        .pop()
        .end();
    }
  },
  watch: {
    items: {
      handler: function(newValue, oldValue) {
        // 找到变动的数值，并在其上显示动画
        newValue.forEach((val, index) => {
          const old = oldValue[index];
          if (val.name !== old.name || val.value !== old.value) {
            this.animate(index);
          }
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="stylus"></style>
