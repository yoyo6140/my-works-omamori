<template>
  
  <loading-spinner v-if="isLoading"></loading-spinner>
    
  <div v-else class="container">
  <my-navbar></my-navbar>
  <hero-carousel></hero-carousel>
      <div class="container mt-4">
        <div class="row">
          <!-- 左側分類欄 -->
          <div class="col-md-3 mb-3">
            <div class="list-group text-start">
              <button 
                v-for="cat in categories" 
                :key="cat" 
                type="button" 
                class="list-group-item list-group-item-action"
                :class="{ active: categoryFilter === cat }"
                @click="categoryFilter = cat">
                <img :src="require('@/assets/torii.png')" alt="icon" style="width:20px; height:20px;" class="me-2">
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- 商品卡片區 -->
          <div class="col-md-9">
            <div class="row g-3" style="min-height: 200px;">
              <div v-for="item in filteredProducts" :key="item.id" class="col-md-4">
                <div class="card h-100">
                  <div class="card-img-top" 
                       :style="{ 
                          backgroundImage: `url(${item.imageUrl})`, 
                          height: '200px',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }" 
                        @click="goProductPage(item.id)">
                  </div>
                  <div class="mb-3">
                    <div class="row">
                      <h5 class="card-title text-start">
                        <img :src="require('@/assets/torii.png')" alt="icon" style="width:20px; height:20px;" class="me-2">
                        {{ item.title }}</h5>
                    </div>
                    <div class="row">
                      <p class="card-text">商品:{{ item.description }}</p>
                    </div>
                    <div class="row text-end">
                      <span class="text-warning">NT {{ item.price }} 元</span>
                    </div>
                  </div>

                  <!-- 底部黑色按鈕區 -->
                  <div class="card-footer d-flex justify-content-between bg-dark">
                    <button href="#"
                      class="btn btn-outline-warning btn-sm"
                      @click.prevent="goProductPage(item.id)">
                      顯示更多
                    </button>

                    <button class="btn btn-outline-warning btn-sm" @click="addCart(item.id)">
                      加到購物車
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="filteredProducts.length === 0" class="col-12 text-center text-muted py-5">
                尚無商品
              </div>
            </div>
          </div>
        </div>
        <my-footer></my-footer>
      </div>
     <!-- 右下固定購物車按鈕，直接路由跳轉 -->
    <router-link :to="{name:'UserCarts'}" class="cart-btn" title="前往購物車">
      <div>
      <img :src="require('@/assets/carts.png')" alt="購物車" class="cart-icon">
      <span class="carts  bg-warning">{{ cartCount }}</span>
      </div>
    </router-link>
  </div>
  
  
 

</template>

<script>
import MyNavbar from '@/components/MyNavbar.vue'
import HeroCarousel from '@/components/HeroCarousel.vue'
import MyFooter from '@/components/MyFooter.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name:'UserGoods',
  components: { MyNavbar, MyFooter, LoadingSpinner,HeroCarousel },
  data() {
    return {
      products: [],
      categories: [
        "北海道・東北（北部）",
        "關東・中部（東中部）",
        "近畿・中國・四國（西部）",
        "九州・沖繩（南部）"
      ],
      categoryFilter: '',  
      isLoading: true,
      cartCount: 0
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(p => p.category === this.categoryFilter)
    }
  },
  methods: {
    getProducts() {
      this.$http.get(`${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`)
        .then(res => { 
          this.products = res.data.products; 
          this.isLoading = false 
        })
    },
    addCart(id) {
      this.$http.post(`${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`, { data: { product_id: id, qty: 1 } })
        .then(() => {
          alert('已加入購物車')
          this.updateCartCount() 
        })
    },
    goProductPage(id) {
      this.$router.push(`/goods/${id}`)
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
    // 預設選擇第一個分類
    if (this.categories.length > 0) {
      this.categoryFilter = this.categories[0];
    }
    this.getProducts()
    this.updateCartCount() 
  }
}
</script>


<style scoped>
.list-group-item.active {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}

.container {
  min-height: 600px; /* 視頁面設計調整 */
}

.cart-btn {
  position: fixed;
  
  bottom: 30px;
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
