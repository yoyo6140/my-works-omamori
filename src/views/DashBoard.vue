<template>
  
    <DashNavbar></DashNavbar>
    <router-view />

  
  
</template>

<script>
import DashNavbar from '@/components/DashNavbar.vue';
import emitter from '@/methods/emitter';
export default {
    name:'DashBoard',
    components:{DashNavbar},
    
    provide() {
      return {
            emitter
        }
    }
    

}
</script>

<style>

</style>