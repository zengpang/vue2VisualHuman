<template>
  <div :class="'tabPage' + (isSelected ? '' : 'hide')">
    <slot name="tabPage"> </slot>
  </div>
</template>
<style scoped>
.tabPage {
  width: 100%;
  color: white;
}
.tabPage.hide {
  display: none;
}
</style>
<script>
import agency from "../lib/agency";
export default {
  name: "tabPage",
  props: ["title", "name", "isSelected"],
  data() {
    return {};
  },
  methods: {
    updateSelect(selectedName) {
      if (this.name === selectedName) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    }
  },
  created() {
    agency.$on("updateSelect", updateSelect);
  }
};
</script>
