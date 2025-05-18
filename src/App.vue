<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

:root {
  --color-primary: #2563eb;
  --color-primary-700: #1d4ed8;
}

.bg-primary {
  background-color: var(--color-primary);
}

.bg-primary-700 {
  background-color: var(--color-primary-700);
}

.text-primary {
  color: var(--color-primary);
}

body {
  margin: 0;
  padding: 0;
}
</style>