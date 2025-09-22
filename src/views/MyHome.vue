<template>
  
  <loading-spinner v-if="isLoad" ></loading-spinner>

  <div v-else class="container">
    <my-navbar></my-navbar>
    <hero-carousel></hero-carousel> 
    <omamori-intro></omamori-intro>
    <router-view></router-view>
    <my-footer></my-footer>
  </div>
  <router-link :to="{name:'UserGoods'}" class="cart-btn" title="前往購物">
    <div>
    <img :src="require('@/assets/buy.png')" alt="產品" class="cart-icon">
    </div>
  </router-link>
</template>

<script>
import MyNavbar from '@/components/MyNavbar.vue';
import HeroCarousel from '@/components/HeroCarousel.vue';
import OmamoriIntro from '@/components/OmamoriIntro.vue';
import MyFooter from '@/components/MyFooter.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name:'MyHome',
  components:{
    MyNavbar,
    HeroCarousel,
    OmamoriIntro,
    MyFooter,
    LoadingSpinner
  },
  data() {
    return {
      isLoad: true  // 初始為 true，表示頁面正在載入
    }
  },
  watch: {
    $route() {
      // 每次路由變化都重置 isLoad
      this.isLoad = true;
      setTimeout(() => {
        this.isLoad = false;
      }, 500); // 你的特效持續時間
    }
  },
  mounted() {
    // 模擬頁面載入完成，2秒後關閉 spinner
    setTimeout(() => {
      this.isLoad = false
    }, 2000)
  }

}
</script>

<style scoped>
.cart-btn {
  position: fixed;
  
  bottom: 60px;
  right: 30px;
  width: 100px;
  height: 100px;
  background-color: bisque;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  text-decoration: none;
  
}

.cart-icon {
  width: 70%;
  height: 70%;
  object-fit: contain;
}
</style>