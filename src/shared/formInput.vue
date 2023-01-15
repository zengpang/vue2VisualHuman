<template>
    <div>
       <p :class="'formInputTitle'">{{title}}</p>
       <input 
       :type="inputType?inputType:'number'" 
       :class="'formInput'+' '+inputType">
    </div>
</template>
<style scoped>
   .formInput{
     color: white;
     font-size: 12px;
   }
   .formInput.number{

   }
   .formInput.color{

   }
   .formInput.range{

   }
   .formInputTitle{

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
