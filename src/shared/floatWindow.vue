<template>
  <div class="floatWindow">
    <header>
        <textIcon iconType="reset" class="resetBtn" />
        <p class="windowTitle">{{title}}</p>
        <textIcon iconType="arrow" class="icon" />
    </header>
    <tabPageBar >
      <tabPage slot="tabPages" :key="'身体1'" name="身体1">
        <div slot="tabPage" class="tabPageContent">
            <formInput inputType="number" hint="请输入数字" title="环境光贴图强度" class="numberInput"/>
            <formInput inputType="color" title="高光度"  class="numberInput"/>
        </div>
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
.floatWindow header{
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
.floatWindow p{
   width: 100px; 
}
.floatWindow .windowTitle{
  color: white;
  font-size: 18px;
  margin-bottom: 9px;
  margin-top: 9px;
  font-weight: bold;
  
}
.floatWindow .icon{
    display: flex;
    flex-direction: row;
    justify-content: end;
}
.floatWindow .reset{
    display: flex;
    flex-direction: row;
    justify-content: start;
}
.floatWindow .tabPageContent{
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
}
.floatWindow .tabPageContent .numberInput{
    width: 95%;
}
.tabPageContent{
    height: 20.8vh;
    min-height: 170px;

}
</style>
<script>
import tabPageBar from './tabPageBar.vue';
import tabPage from './tabPage.vue';
import textIcon from './textIcon.vue';
import formInput from './formInput.vue';

export default {
  name: "floatWindow",
  props:['title'],
  components:{
    tabPageBar,
    tabPage,
    textIcon,
    formInput
  },
  data() {
    return {};
  },
  methods: {
    matInputEvent(event){

    }
  }
};
</script>
