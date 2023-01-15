<template>
  <p :class="'textIcon '+iconType" @click="onClick"></p>
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
  props: ["iconType","onClick"],
  data() {
    return {};
  },
  methods: {}
};
</script>
