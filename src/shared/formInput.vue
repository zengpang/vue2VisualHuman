<template>
  <div class="formInput">
    <p :class="'formInputTitle'">{{ title }}</p>
    <input
      :type="inputType ? inputType : 'number'"
      :class="inputType"
      :on-input="oninputEvent"
      :placeholder="hint"
      :value="value"
    />
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

.formInput .range {
}
.formInput .formInputTitle {
  align-self: flex-start;
}
</style>
<script>
export default {
  name: "formInput",
  props: ["hint", "inputType", "title", "oninputEvent","value"],
  data() {
    return {};
  },

  methods: {}
};
</script>
