<template>  
  <formulario/>
</template>

<script>
import formulario from '@/components/formularioComponent.vue'

export default {
  name: 'App',
  components: {
    formulario
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
