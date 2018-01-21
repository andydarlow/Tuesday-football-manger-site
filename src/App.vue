<template>
  <div id="app">
    <div id="side-menu">
      <ul>
        <li>
          <router-link :to="{name: 'MembersEditorPage'}">Edit Players</router-link>
        </li>
        <li>
          <router-link :to="{name: 'MatchConfigurationPage'}">Manage Game</router-link>
        </li>
      </ul>
    </div>
    <div id ="main-area">
      <router-view/>
    </div>

  </div>
</template>



<script>
  export default {
    name: 'tuesday-footie'
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#side-menu {
  float: left;
  width: 15%;
}
#main-area {
  float: right;
  width: 85%;
}

</style>
