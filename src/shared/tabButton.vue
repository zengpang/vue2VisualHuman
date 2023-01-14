<template>
    <button :class="'tabButton'+(isSelected?' show':'')" :style="buttonStyle" >
         {{Content}}
    </button>
 </template>
 <style scoped>
     .tabButton{
      border-radius: 5px;
      background: transparent;
      border: none;
      color: white;
      font-family: Arial, Helvetica, sans-serif;
     }
     .tabButton.show{
     
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.6);
     }
 </style>
 <script>
    export default{
       name:'tabButton',
       props:['buttonStyle','onClick','Content','isSelected'],
       data(){
         return {

         };  
       },
       methods:{
         
       }
    }
 </script>