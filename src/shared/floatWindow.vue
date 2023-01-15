<template>
  <div class="floatWindow">
    <header>
        <textIcon iconType="reset" class="resetBtn" />
        <p class="windowTitle">{{title}}</p>
        <textIcon iconType="arrow" class="icon" />
    </header>
    <tabPageBar >
      <tabPage slot="tabPages" :key="'参数1'" name="参数1">
        <div slot="tabPage" class="tabPageContent">
            <formInput 
            inputType="number" 
            hint="请输入数字" 
            title="环境光贴图强度"  
            class="numberInput"           
            :oninputEvent="matInputEvent"
            :value="this.matValue.bodyMatInfo._Expose.value"
            :inputid="'_ExposeInput'"
            />
            <formInput 
            inputType="color" 
            title="主颜色"  
            class="numberInput"
            :oninputEvent="matInputEvent" 
            :value="this.matValue.bodyMatInfo._mainColor.value"
            :inputid="'_mainColorInput'"
            />
        </div>
      </tabPage>
      <tabPage slot="tabPages" :key="'参数2'" name="参数2">
        <div slot="tabPage" class="tabPageContent">参数2</div>
      </tabPage>
      <tabPage slot="tabPages" :key="'参数3'" name="参数3">
        <div slot="tabPage" class="tabPageContent">参数3</div>
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
import { materialInfo } from '../lib/material';
import {rgbToHex,hexToRGB} from '../lib/color';
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
    return {
        matValue:materialInfo
    };
  },
  methods: {
    matInputEvent(event){
      switch(event.target.id)
      {
        case'_ExposeInput':{

        };break;
        case'_mainColorInput':{
            
        };break;
        case'_ExposeInput':{
            
        };break;
      }
    },
    findInput()
    {

    }
   
  },
 
  mounted(){
  
    
  }
};
</script>
