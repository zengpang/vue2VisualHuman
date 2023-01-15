<template>
    <div class="formInput">
       <p :class="'formInputTitle'">{{title}}</p>
       <input 
       :type="inputType?inputType:'number'" 
       :class="inputType"/>
    </div>
</template>
<style scoped>
   .formInput{
     color: white;
     font-size: 12px;
     font-family: "SimHei";
     display: flex;
     align-items: center;
     flex-direction: column;
   }
   .formInput .number{
      width: 100%;
      border: none;
      padding: 0;
   }
   .formInput .color{

   }
   .formInput .range{

   }
   .formInput .formInputTitle{
    align-self: flex-start;
   }
   
</style>
<script>
   
  export default {
  name: "formInput",
  props: ["hint","inputType","title"],
  data() {
    return {};
  },
  methods: {

  }
};
</script>
