<template>
   
  
  <div class="container">
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
                  :src="item.product.imageUrl "
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
        <div class="d-flex justify-content-end mb-3">
          <div class="input-group mb-3 d-flex justify-content-end" style="max-width: 300px;" >
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
          >前往結帳
        </button>
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
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

export default {
  name: 'UserCarts',
  components: {
    MyNavbar,
    MyFooter
    },
  data() {
    return {
      
      cart: {
        carts: [],
        total: 0,
        final_total: 0
      },
      coupon_code: '',
    }
  },
  methods: {
    async getCarts() {
      try {
        const httpRes = await fetch(API.cart())
        const res = await httpRes.json()
        this.cart = res.data || { carts: [], total: 0, final_total: 0 }
      } catch (err) {
        notify.error('取得購物車失敗')
        this.cart = { carts: [], total: 0, final_total: 0 }
      }
    },
    async updateCart(item) {
      const cart = { product_id: item.product_id, qty: item.qty }
      try {
        await fetch(API.cartItem(item.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: cart }),
        })
        this.getCarts()
      } catch (err) {
        notify.error('更新購物車失敗')
      }
    },
    async removeCart(id) {
      try {
        await fetch(API.cartItem(id), { method: 'DELETE' })
        this.getCarts()
      } catch (err) {
        notify.error('刪除商品失敗')
      }
    },
    checkout() {
      if (this.cart.carts.length === 0) {
        notify.warn('購物車沒有商品，無法結帳！')
        return
      }
      // 將購物車資料存在 cookie
      Cookies.set('checkoutCart', JSON.stringify(this.cart), { expires: 1 })
      this.$router.push({ name: 'UserCheckout' })
    },
    async applyCoupon() {
      if (!this.coupon_code) {
        notify.warn('請輸入優惠碼')
        return
      }
      try {
        const httpRes = await fetch(API.coupon(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { code: this.coupon_code } }),
        })
        const res = await httpRes.json()
        if (res?.success === false) {
          notify.error(res.message || '套用優惠碼失敗')
          return
        }
        notify.success('已套用優惠碼')
        this.getCarts()
      } catch (err) {
        notify.error('套用優惠碼失敗')
      }
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
