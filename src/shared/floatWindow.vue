<template>
  <div class="floatWindow">
    <p class="windowTitle">{{title}}</p>
    <tabPageBar >
      <tabPage slot="tabPages" :key="'身体1'" name="身体1">
        <div slot="tabPage" class="tabPageContent">身体1</div>
      </tabPage>
      <tabPage slot="tabPages" :key="'身体2'" name="身体2">
        <div slot="tabPage" class="tabPageContent">身体2</div>
      </tabPage>
      <tabPage slot="tabPages" :key="'头发2'" name="头发2">
        <div slot="tabPage" class="tabPageContent">头发2</div>
      </tabPage>
    </tabPageBar>
  </div>
</template>
<style scoped>
.windowTitle{
  color: white;
  font-size: 18px;
  margin-bottom: 9px;
  margin-top: 9px;
  font-weight: bold;
}
.floatWindow {
  width: 92.36vw;
  min-height: 240px;
  height: 32.62vh;
  border-radius: 15px;
  background: rgba(25, 69, 104, 1);
  display: flex;
  align-items: center;
  flex-direction: column;
}
.tabPageContent{
    height: 20.8vh;
    min-height: 170px;
    
}
</style>
<script>
import tabPageBar from './tabPageBar.vue';
import tabPage from './tabPage.vue';

export default {
  name: "floatWindow",
  props:['title'],
  components:{
    tabPageBar,
    tabPage
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
