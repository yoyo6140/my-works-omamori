<template>
   <loading-spinner v-if="isLoad"></loading-spinner>
  
  <div v-else>
    <my-navbar></my-navbar>
    <div class="container mt-4">
      <h3>購物車</h3>
    
      <div >
        <!-- 購物車空的情況 -->
        <div v-if="cart.carts.length === 0" class="text-center py-5 text-muted">
          購物車目前沒有商品
        </div>

        <!-- 購物車列表 -->
        <table v-else class="table table-hover align-middle">
          <thead>
            <tr>
              <th>商品</th>
              <th>單價</th>
              <th>數量</th>
              <th>小計</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart.carts" :key="item.id">
              <td class="d-flex align-items-center">
                <img
                  :src="item.product.imageUrl || '/images/default.png'"
                  alt=""
                  style="width: 60px; height: 60px; object-fit: cover;"
                  class="me-2"
                >
                <span>{{ item.product.title }}</span>
              </td>
              <td>NT {{ item.product.price || item.product.origin_price }} 元</td>
              <td>
                <input
                  type="number"
                  class="form-control"
                  style="width:80px"
                  v-model.number="item.qty"
                  @change="updateCart(item)"
                >
              </td>
              <td>
                NT {{ (item.product.price || item.product.origin_price) * item.qty }} 元
              </td>
              <td>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="removeCart(item.id)"
                >
                  刪除
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 優惠券輸入欄位 -->
        <div class="input-group mb-3" style="max-width: 300px;">
          <input
            type="text"
            class="form-control"
            v-model="coupon_code"
            placeholder="請輸入優惠碼"
          >
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="applyCoupon"
          >
            套用優惠碼
          </button>
        </div>

        <!-- 總計與折扣金額 -->
        <div class="d-flex justify-content-end mt-3">
          <h5>
            
            總計：
            <span v-if="cart.final_total && cart.final_total !== cart.total">
              <s class="text-muted">NT {{ cart.total }} 元</s>
              <span class="text-success ms-2">
                NT {{ Math.round(cart.final_total) }} 元
              </span>
            </span>
            <span v-else>
              NT {{ cart.total }} 元
            </span>
          </h5>
          
        </div>
        <button 
          class="btn btn-danger" 
          @click="checkout"
          :disabled="cart.carts.length === 0"
          >前往結帳</button>
     </div> 
    </div>
  </div>
  <my-footer></my-footer>
   <!-- 結帳子路由 -->
</template>

<script>
import Cookies from 'js-cookie'
import MyNavbar from '@/components/MyNavbar.vue'
import MyFooter from '@/components/MyFooter.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default {
  name: 'UserCarts',
  components: {
    MyNavbar,
    MyFooter,
    LoadingSpinner
  },
  data() {
    return {
      
      cart: {
        carts: [],
        total: 0,
        final_total: 0
      },
      coupon_code: '',
      isLoad:true
    }
  },
  methods: {
    getCarts() {
      this.isLoad= true
      this.$http
        .get(`${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`)
        .then(res => {
          this.cart = res.data.data || { carts: [], total: 0, final_total: 0 }
          this.isLoad = false
        })
    },
    updateCart(item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`
      const cart = {
        product_id: item.product_id,
        qty: item.qty
      }
      this.$http.put(url, { data: cart }).then(() => this.getCarts())
    },
    removeCart(id) {
      this.$http
        .delete(`${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`)
        .then(() => this.getCarts())
    },
    checkout() {
      if (this.cart.carts.length === 0) {
        alert('購物車沒有商品，無法結帳！')
        return
      }
      // 將購物車資料存在 cookie
      Cookies.set('checkoutCart', JSON.stringify(this.cart), { expires: 1 })
      this.$router.push({ name: 'UserCheckout' })
    },
    applyCoupon() {
      if (!this.coupon_code) {
        alert('請輸入優惠碼')
        return
      }
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`
      this.$http.post(url, { data: { code: this.coupon_code } })
        .then(() => {
          this.getCarts()
        })
    }
  },
  created() {
    this.getCarts()
  }
}
</script>

<style scoped>
img {
  border-radius: 4px;
}
s {
  font-size: 0.9em;
}
.container {
  min-height: 600px; /* 視頁面設計調整 */
}
</style>
