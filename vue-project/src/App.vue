<template>
  <nav>
    <router-link to="/">Review</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {}

* {
  @import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
  font-family: 'Lato', sans-serif;
}

body {
  background-color: #f5f5f5;
}
</style>

