<template>
  <div id="app">
    <mainPage></mainPage>
  </div>
</template>

<script>
import mainPage from './views/mainPage'

export default {
  name: 'App',
  components: {
    mainPage
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
