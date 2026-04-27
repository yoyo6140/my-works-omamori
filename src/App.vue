<template>
  <router-view />
  <message-toast />

</template>

<script>
import MessageToast from '@/components/MessageToast.vue'

export default {
  name: 'App',
  components: { MessageToast },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
