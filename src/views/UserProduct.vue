<template>
  <loading-spinner v-if="isLoading"></loading-spinner>

   
  <div class="container mt-3" v-else>
    <my-navbar></my-navbar>
    <hero-carousel></hero-carousel>
    <!-- 麵包屑 -->
    <nav aria-label="breadcrumb" class="row mb-3">
      <ol class="col-7   justify-content-center mt-3  breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/">首頁</router-link>
        </li>
        <li class="breadcrumb-item" v-if="product.category">
          <router-link :to="{ name: 'UserGoods', params: { category: product.category } }">
            {{ product.category }}
          </router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ product.title }}
        </li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <!-- 左側圖片輪播 + 縮圖 -->
      <div class="col-md-4">
        <div id="productCarousel" class="carousel slide mb-3" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img
                :src="product.imageUrl "
                class="d-block w-100"
                style="height: 300px; object-fit: cover;"
                alt="主圖"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 右側產品資訊卡片 -->
      <div class="col-md-5">
        <div class="card shadow-sm p-3">
          <h2 class="card-title">{{ product.title }}</h2>
          <p class="text-muted mb-1">分類：{{ product.category }}</p>
          <p class="mb-2">商品:{{ product.description }}</p>
          <p class="text-muted small">說明：{{ product.content }}</p>
          <p class="fs-5 mb-2">
            <span class="text-danger fw-bold">價格:{{ product.price }} 元</span>
          </p>
          <button class="btn btn-danger w-100" @click="addCart(product.id)">
            加到購物車
          </button>
        </div>
      </div>
    </div>
    <my-footer></my-footer>
    
  </div>
    
  
  <router-link :to="{name:'UserCarts'}" class="cart-btn" title="前往購物車">
    <div>
    <img src="/images/carts.png" alt="購物車" class="cart-icon">
    <span class="carts  bg-warning">{{ cartCount }}</span>
    </div>
  </router-link>
</template>

<script>
import MyNavbar from '@/components/MyNavbar.vue'
import HeroCarousel from '@/components/HeroCarousel.vue'
import MyFooter from '@/components/MyFooter.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
// ✅ 直接 import bootstrap
import * as bootstrap from 'bootstrap'

export default {
  name: 'UserProduct',
  components: { MyNavbar, MyFooter, LoadingSpinner,HeroCarousel },
  data() {
    return {
      product: {
        imagesUrl: []
      },
      isLoading: true,
      cartCount:0
    }
  },
  
  methods: {
    getProduct() {
      const id = this.$route.params.id
      this.$http.get(
        `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${id}`)
        .then(res => {
          this.product = res.data.product
          if (!this.product.imagesUrl) this.product.imagesUrl = []
          this.isLoading = false
        })
    },
    addCart(id) {
      this.$http.post(
        `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`, 
        { data: { product_id: id, qty: 1 } })
        .then(() => alert('已加入購物車'))
    },
    goToSlide(index) {
      const carouselEl = document.querySelector('#productCarousel')
      // ✅ 使用 import bootstrap 的方式
      const carousel = bootstrap.Carousel.getInstance(carouselEl) || new bootstrap.Carousel(carouselEl)
      carousel.to(index)
    },
    updateCartCount() {
      this.$http.get(`${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`)
        .then(res => {
          const carts = res.data.data.carts || []
          // 將每個商品的 qty 加總，得到總件數
          this.cartCount = carts.reduce((total, item) => total + (item.qty || 0), 0)
        })
        .catch(() => {
          this.cartCount = 0
        })
    }

  },
  created() {
    this.getProduct()
    this.updateCartCount() 
  }
}
</script>

<style scoped>
img {
  height: 400px;
  object-fit: cover;
}

.thumb-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}

.thumb-img:hover {
  border-color: #ff4d4f;
}

.cart-btn {
  position: fixed;
  
  bottom:60px;
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

.carts {
 
  position:absolute;
  width: 25px;
  height: 25px;
  border-radius:50%;
  display: flex;
  justify-content: center;
  align-items: center;
  right:-9px;
  top:-8px;

}
</style>
