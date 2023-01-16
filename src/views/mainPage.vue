<template>
  <div class="mainPage">
    <threeJsShow>

        </threeJsShow>
    <floatWindow class="floatWindow" title="设置界面" />
  </div>
</template>
<style scoped>
.mainPage {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.floatWindow {
  position: fixed;
  bottom: 20px;
}
</style>
<script>
import threeJsShow from "../components/threeJsShow.vue";
import { materialInfo } from "../lib/material";
import Vue from "vue";
import floatWindow from "../shared/floatWindow.vue";
import { Toast } from "vant";

Vue.use(Toast);
export default {
  name: "mainPage",
  data() {
    return {
      
    };
  },
  components: {
    threeJsShow,
    floatWindow
  },
  methods: {
    //    Test(){
    //      console.log(materialInfo.bodyMatInfo._mainColor);
    //    }
  },
  mounted() {
    // this.Test();
  }
};
</script>
