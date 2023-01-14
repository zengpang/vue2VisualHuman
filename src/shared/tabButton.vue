<template>
  <button
    :class="'tabButton' + (isSelected ? ' show' : '')"
    :style="buttonStyle"
    @click="onClick"
  >
    {{ Content }}
  </button>
</template>
<style scoped>
.tabButton {
  border-radius: 5px;
  background: transparent;
  border: none;
  color: white;
  font-family: "SimHei";
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s;
}
.tabButton.show {
  color: black;
  font-family: "SimHei";
  font-weight: 700;
  font-size: 14px;
  height: 83.78%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.6);
}
</style>
<script>
export default {
  name: "tabButton",
  props: ["buttonStyle", "onClick", "Content", "isSelected"],
  data() {
    return {};
  },
  methods: {}
};
</script>
