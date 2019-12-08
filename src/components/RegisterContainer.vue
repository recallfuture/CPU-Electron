<template>
  <div
    class="register-container container container-line container-left"
    :class="{ 'rot-left': left, 'rot-right': right }"
  >
    <h3>{{ title }}</h3>
    <div>
      <div
        v-for="(item, index) in list"
        :key="index"
        :ref="'index' + index"
        class="register"
        style="transition-duration: 200ms; color: rgb(55, 243, 255); background-color: rgb(11, 11, 11); transition-delay: 100ms;"
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
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatNum
  },
  watch: {
    list: {
      handler: function(newValue, oldValue) {
        newValue.forEach((val, index) => {
          const old = oldValue[index];
          if (val.name !== old.name || val.value !== old.value) {
            move(this.$refs["index" + index][0])
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
        });
      },
      deep: true
    }
  }
};
</script>

<style lang="stylus"></style>
