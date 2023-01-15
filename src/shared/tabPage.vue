<template>
  <div :class="'tabPage' + (isSelected ? '' : ' hide')">
    <slot name="tabPage"> </slot>
  </div>
</template>
<style scoped>
.tabPage {
  width: 100%;
  color: white;
  margin-top: 12px;
  margin-bottom: 12px;
}
.tabPage.hide {
  display: none;
}
</style>
<script>
import agency from "../lib/agency";
export default {
  name: "tabPage",
  props: ["title", "name"],
  data() {
    return {isSelected:false};
  },
  methods: {
    updateSelect(selectedName) {
      console.log("触发");
      if (this.name === selectedName) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    }
  },
  created() {
    agency.$on("updateSelect", this.updateSelect);
  }
};
</script>
