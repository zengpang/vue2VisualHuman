<template>
  <div class="formInput">
    <p :class="'formInputTitle'" >
      {{ title+(inputType==='range'?"值为"+rangeShowValue:'') }} 
    </p>
    <input
      :type="inputType ? inputType : 'number'"
      :class="inputType"
      @input="matInputEvent"
      :placeholder="hint"
      :value="matValue"
      :id="inputid"
      v-if="inputType!='range'&&inputType!='vector3'"
    />
    <input
      :type="inputType ? inputType : 'number'"
      :class="inputType"
      @input="matInputEvent"
      :placeholder="hint"
      :value="matValue"
      :id="inputid"
      :max="maxValue?maxValue:1"
      :min="minValue?minValue:0"
      :step="stepValue"
      v-model="rangeShowValue"
      v-if="inputType==='range'&&inputType!='vector3'"
    />
    <div class="inputs" v-if="inputType==='vector3'">
      <input
      :type="'number'"
      :class="inputType"
      @input="matInputEvent"
      :placeholder="hint"
      :value="matValue.x"
      :id="inputid+'x'"
      
    />
    <input
      :type="'number'"
      :class="inputType"
      @input="matInputEvent"
      :placeholder="hint"
      :value="matValue.y"
      :id="inputid+'y'"
     
    />
    <input
      :type="'number'"
      :class="inputType"
      @input="matInputEvent"
      :placeholder="hint"
      :value="matValue.z"
      :id="inputid+'z'"
      
    />
    </div>
  </div>
</template>
<style scoped>
.formInput {
  color: white;
  font-size: 12px;
  font-family: "SimHei";
  display: flex;
  align-items: center;
  flex-direction: column;
}
.formInput input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #d5d5d5;
  /* placeholder字体大小  */
  font-size: 12px;
  font-style: italic;
}
.formInput .number {
  width: 96%;
  border: none;
  padding: 0;
  border-radius: 5px;
  background: rgba(122, 147, 167, 1);
  min-height: 24px;
  height: 4.342vh;
  padding-left: 7px;
  padding-right: 7px;
  color: white;
}
.formInput .number:focus {
  outline: none;
}
.formInput .color {
  width: 100%;
  border: none;
  padding: 0;
  border-radius: 5px;
  min-height: 24px;
  height: 4.342vh;
  outline: none;

  border-radius: 5px;
  background: none;
  border: none;
}
.formInput .inputs{
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.formInput .inputs .vector3{
  width: 25%;
  border: none;
  padding: 0;
  border-radius: 5px;
  background: rgba(122, 147, 167, 1);
  min-height: 24px;
  height: 4.342vh;
  padding-left: 7px;
  padding-right: 7px;
  color: white;
}
.formInput .inputs .vector3:focus {
  outline: none;
}
.formInput .range {
  width: 100%;
  min-height: 24px;
  height: 4.342vh;
}
.formInput .formInputTitle {
  align-self: flex-start;
}
</style>
<script>
import {rgbToHex} from '../lib/color';
export default {
  name: "formInput",
  props: [
    "hint", 
  "inputType",
   "title",
   "value",
   "inputid",
   "maxValue",
   "minValue",
   "stepValue"
  ],
  data() {
    return {
      rangeShowValue:0
    };
  },
  computed:{
    matValue:{
      get()
      {
         let result=this.value;
         switch(this.inputType)
         {
            case 'color':{
              result=rgbToHex(this.value.x,this.value.y,this.value.z);
              console.log(result);
            };break;
            
         }
         console.log("属性修改")
         return result;
      },
      set(newValue)
      {
         console.log(newValue);
      }
    }
  },
  methods: {
    matInputEvent(event){
      if(this.inputType==='ranger')
      {
        this.rangeShowValue=event.target.value;
      }
      
    },
  },
  mounted(){
   
    this.rangeShowValue=this.value;
  }
};
</script>
