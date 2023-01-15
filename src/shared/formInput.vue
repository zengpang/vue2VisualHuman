<template>
  <div class="formInput">
    <p :class="'formInputTitle'">{{ title }}</p>
    <input 
    :type="inputType ? inputType : 'number'" 
    :class="inputType"
    :on-input="oninputEvent"
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

.formInput .number {
  width: 100%;
  border: none;
  padding: 0;
  border-radius: 5px;
  background: rgba(122, 147, 167, 1);
  min-height: 24px;
  height: 4.342vh;
}
.formInput .number:focus {
  outline: none;
}
.formInput .color {
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
  props: ["hint", 
     "inputType",
         "title",
         "oninputEvent"],
  data() {
    return {};
  },
  methods: {}
};
</script>
