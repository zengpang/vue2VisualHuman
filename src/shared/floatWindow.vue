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
            :value="this.matValue.bodyMatInfo._Expose.value"
            :inputid="'_ExposeInput'"
            />
            <formInput 
            inputType="color" 
            title="主颜色"  
            class="numberInput" 
            :value="this.matValue.bodyMatInfo._mainColor.value"
            :inputid="'_mainColorInput'"
            />
        </div>
      </tabPage>
      <tabPage slot="tabPages" :key="'参数2'" name="参数2">
        <div slot="tabPage" class="tabPageContent">
            <formInput 
            inputType="range" 
            hint="请输入数字" 
            title="阴影强度"   
            class="numberInput"           
            :value="this.matValue.bodyMatInfo._shadowInit.value"
            :inputid="'_shadowInitInput'"
            :stepValue="0.1"
            />
            <formInput 
            inputType="color" 
            title="高光颜色"  
            class="numberInput" 
            :value="this.matValue.bodyMatInfo._speculaColor.value"
            :inputid="'_speculaColorInput'"
            />
            
        </div>
      </tabPage>
      <tabPage slot="tabPages" :key="'参数3'" name="参数3">
        <div slot="tabPage" class="tabPageContent">
            <formInput 
            inputType="range" 
            hint="请输入数字" 
            title="SSS V轴偏转值"   
            class="numberInput"           
            :value="this.matValue.bodyMatInfo._sssVOffset.value"
            :inputid="'_sssVOffsetInput'"
            :stepValue="0.1"
            />
            <formInput 
            inputType="range" 
            hint="请输入数字" 
            title="SSS U轴偏转值"   
            class="numberInput"           
            :value="this.matValue.bodyMatInfo._sssUOffset.value"
            :inputid="'_sssUOffsetInput'"
            :stepValue="0.1"
            />
        </div>
      </tabPage>
      <tabPage slot="tabPages" :key="'参数4'" name="参数4">
        <div slot="tabPage" class="tabPageContent">参数4</div>
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
        matValue:materialInfo,
        componentTitle:'阴影强度'
    };
  },
  methods: {
  
    findInput()
    {

    }
   
  },
 
  mounted(){
  
    
  }
};
</script>
