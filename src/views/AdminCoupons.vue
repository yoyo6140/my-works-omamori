<template>
  <loading-spinner v-if="isLoad"></loading-spinner>
  <div class="container" v-else>
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click.prevent="openCouponModal(true)">
        建立新的優惠券
      </button>
    </div>

    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>優惠碼</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ formatDate(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm"
                      @click="openCouponModal(false, item)">
                編輯
              </button>
              <button class="btn btn-outline-danger btn-sm"
                      @click="delCoupon(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <couponModal :coupon="tempCoupon" ref="couponModal"
                 @update-coupon="updateCoupon"/>
  </div>
  <my-pagination :pages="pagination" @emit-pages="getCoupons"></my-pagination>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import CouponModal from '../components/couponModals.vue';
import MyPagination from '@/components/MyPagination.vue';
import { API, adminHeaders } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'

export default {
  name:'MyCoupons',
  components: { CouponModal,LoadingSpinner,MyPagination },

  data() {
    return {
      coupons: [],  
      tempCoupon: {},
      isLoad: true,
      isNew: false,
      pagination:{}
    };
  },

  methods: {
    // timestamp → YYYY-MM-DD
    formatDate(timestamp) {
      if (!timestamp) return '';
      return new Date(timestamp * 1000).toISOString().split('T')[0];
    },

    openCouponModal(isNew, item = null) {
      this.isNew = isNew;
      if (this.isNew) {
        this.tempCoupon = { 
          title: '',
          code: '',
          percent: 100,
          is_enabled: 1,
          due_date: Math.floor(Date.now() / 1000) // 現在 timestamp
        };
      } else if(item) {
        this.tempCoupon = { ...item }; // 淺拷貝
      }
      this.$refs.couponModal.showModal();
    },

    async getCoupons(page = 1 ) {
      try {
        const httpRes = await fetch(API.adminCoupons(page), {
          headers: adminHeaders(),
        })
        const res = await httpRes.json()
        if(res.success){
          this.coupons = res.coupons
          this.pagination = res.pagination
        } else {
          notify.error(res.message || '取得優惠券失敗')
        }
      } catch(err) {
        notify.error('取得優惠券發生錯誤')
      } finally {
        this.isLoad = false;
      }
    },

    async updateCoupon(tempCoupon) {
      const url = this.isNew ? API.adminCoupon() : API.adminCouponById(tempCoupon.id)
      const method = this.isNew ? 'POST' : 'PUT'

      try{
        const httpRes = await fetch(url, {
          method,
          headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: tempCoupon }),
        })
        const res = await httpRes.json()

        if(res.success){
          notify.success(this.isNew ? '新增優惠券成功' : '編輯優惠券成功')
          this.getCoupons();
          this.$refs.couponModal.hideModal();
        } else {
          notify.error(res.message || '操作失敗')
        }
      } catch(err){
        notify.error('操作發生錯誤')
      }
    },

    async delCoupon(item) {
      const confirmDel = confirm(`確定要刪除優惠券 "${item.title}" 嗎？`);
      if(!confirmDel) return;

      this.isLoad = true;
      try {
        const httpRes = await fetch(API.adminCouponById(item.id), {
          method: 'DELETE',
          headers: adminHeaders(),
        })
        const res = await httpRes.json()
        if(res.success){
          notify.success('刪除成功')
          this.getCoupons();
        } else {
          notify.error(res.message || '刪除失敗')
        }
      } catch(err){
        notify.error('刪除發生錯誤')
      } finally {
        this.isLoad = false;
      }
    }
  },

  created(){
    this.getCoupons();
  }
};
</script>
