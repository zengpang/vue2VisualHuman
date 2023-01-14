<template>
    <button class="tabButton" :style="buttonStyle" >
         {{Content}}
    </button>
 </template>
 <style>
     
 </style>
 <script>
    export default{
       name:'tabButton',
       props:['buttonStyle','onClick','Content'],
       data(){
         return {

         };  
       },
       methods:{
         
       }
    }
 </script>