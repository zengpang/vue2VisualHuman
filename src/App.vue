<template>
  <div id="app">
    <threeJsTest/>
  </div>
</template>

<script>
import threeJsTest from './components/threeJsTest'

export default {
  name: 'App',
  components: {
    threeJsTest
  }
}
</script>

<style>
body{
  margin: 0px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}
</style>
