<template>
  <div id="app">
    <img src="https://i.ibb.co/6nswKvh/cap-logo.jpg">
    <router-view/>
  </div>
</template>

<script
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1rem;
  margin-left: 5%;
  margin-right: 5%;
}

img{
  height:8rem;
  margin-bottom:1rem;
}
body{
  background-color: #F8EEEC;
}

.result_hide{
  position: absolute;
  visibility: hidden;
}

</style>
