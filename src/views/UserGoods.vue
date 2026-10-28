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
                <img :src="toriiIcon" alt="icon" style="width:20px; height:20px;" class="me-2">
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- 商品卡片區 -->
          <div class="col-md-9">
            <div class="row g-3" style="min-height: 200px;">
              <div v-for="item in filteredProducts" :key="item.id" class="col-md-4">
                <div class="card h-100 d-flex flex-column">
                  <div
                    class="card-img-top goods-card-thumb"
                    :style="{ 
                          backgroundImage: `url(${item.imageUrl})`, 
                          height: '200px',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }"
                    role="button"
                    tabindex="0"
                    @click="goProductPage(item.id)"
                    @keydown.enter="goProductPage(item.id)"
                  />

                  <div class="goods-card-intro flex-grow-1">
                    <h5 class="goods-card-title mb-0">
                      <img
                        :src="toriiIcon"
                        alt=""
                        width="20"
                        height="20"
                        class="me-2 align-text-top goods-card-title-icon"
                      >
                      {{ item.title }}
                    </h5>
                    <p class="goods-intro-heading mb-1">商品介紹</p>
                    <p class="goods-intro-text mb-0">{{ item.description || '—' }}</p>
                    <div class="goods-price-row">
                      <span class="goods-price">NT {{ item.price }} 元</span>
                    </div>
                  </div>

                  <div class="goods-qty-strip mt-auto px-3 pb-2">
                    <span class="visually-hidden">數量</span>
                    <div class="input-group input-group-sm">
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        aria-label="減少數量"
                        @click.stop="adjustCartQty(item.id, -1)"
                      >
                        −
                      </button>
                      <span
                        class="input-group-text flex-grow-1 justify-content-center"
                      >{{ cartQty(item.id) }}</span>
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        aria-label="增加數量"
                        @click.stop="adjustCartQty(item.id, 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <!-- 底部黑色按鈕區 -->
                  <div class="card-footer d-flex justify-content-between align-items-center gap-2 bg-dark px-3 py-3">
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
      <img :src="cartsIcon" alt="購物車" class="cart-icon">
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
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'
import toriiIcon from '@/assets/torii.png'
import cartsIcon from '@/assets/carts.png'

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
      cartCount: 0,
      cartQtyById: {},
      cartQtyMin: 1,
      cartQtyMax: 999,
      toriiIcon,
      cartsIcon,
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(p => p.category === this.categoryFilter)
    }
  },
  methods: {
    cartQty(id) {
      const raw = this.cartQtyById[id]
      const n =
        typeof raw === 'number' && !Number.isNaN(raw) ? raw : this.cartQtyMin
      return Math.min(this.cartQtyMax, Math.max(this.cartQtyMin, n))
    },
    adjustCartQty(id, delta) {
      const next = this.cartQty(id) + delta
      const clamped = Math.min(
        this.cartQtyMax,
        Math.max(this.cartQtyMin, next)
      )
      this.cartQtyById = { ...this.cartQtyById, [id]: clamped }
    },
    async getProducts() {
      try {
        const httpRes = await fetch(API.productsAll())
        const res = await httpRes.json()
        this.products = res.products || []
      } catch (err) {
        notify.error('取得商品失敗')
      } finally {
        this.isLoading = false
      }
    },
    async addCart(id) {
      const qty = this.cartQty(id)
      try {
        const httpRes = await fetch(API.cart(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { product_id: id, qty } }),
        })
        const res = await httpRes.json()
        if (res?.success === false) {
          notify.error(res.message || '加入購物車失敗')
          return
        }
        notify.success(qty > 1 ? `已加入購物車（${qty} 件）` : '已加入購物車')
        this.cartQtyById = { ...this.cartQtyById, [id]: this.cartQtyMin }
        this.updateCartCount()
      } catch (err) {
        notify.error('加入購物車失敗')
      }
    },
    goProductPage(id) {
      this.$router.push(`/goods/${id}`)
    },
    async updateCartCount() {
      try {
        const httpRes = await fetch(API.cart())
        const res = await httpRes.json()
        const carts = res?.data?.carts || []
        this.cartCount = carts.reduce((total, item) => total + (item.qty || 0), 0)
      } catch (err) {
        this.cartCount = 0
      }
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

.goods-card-thumb {
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.goods-card-intro {
  padding: 1.125rem 1.25rem 1rem;
  text-align: left;
}

.goods-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  color: #212529;
}

.goods-card-title-icon {
  vertical-align: -0.2em;
}

.goods-intro-heading {
  margin-top: 0.875rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6c757d;
}

.goods-intro-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #495057;
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-price-row {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  text-align: right;
}

.goods-price {
  font-size: 1rem;
  font-weight: 600;
  color: #fd7e14;
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
