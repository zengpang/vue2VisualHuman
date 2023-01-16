<template>
  <div class="iconContainer">
    <p :class="'textIcon '+iconType" @click="onClick" :style="iconStyle"></p>
  </div>
</template>
<style>
@font-face {
  font-family: "iconfont";


  src: url("../assets/icon/iconfont.woff2?t=1673695615597") format("woff2"),
    url("../assets/icon/iconfont.woff?t=1673695615597") format("woff"),
    url("../assets/icon/iconfont.ttf?t=1673695615597") format("truetype");
}
.textIcon{
    font-family: "iconfont";
    font-size: 16px;
    color: white;
    transition: all .3s;
    
}

.textIcon.arrow:before{
    content: "\e652";
} 
.textIcon.reset:before{
    content: "\e67d";
}
</style>
<script>

export default {
  name: "textIcon",
  props: ["iconType","onClick","iconStyle"],
  data() {
    return {};
  },
  methods: {}
};
</script>
