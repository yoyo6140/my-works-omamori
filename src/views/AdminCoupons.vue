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
import Cookies from 'js-cookie';
import axios from 'axios';
import MyPagination from '@/components/MyPagination.vue';

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
      const token = Cookies.get('token');
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons/?page=${page}`;

      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });
        if(res.data.success){
          this.coupons = res.data.coupons;
          this.pagination = res.data.pagination;
        } else {
          alert(res.data.message || '取得優惠券失敗');
        }
      } catch(err) {
        console.error(err);
        alert('取得優惠券發生錯誤');
      } finally {
        this.isLoad = false;
      }
    },

    async updateCoupon(tempCoupon) {
      const token = Cookies.get('token');
      let url = '';
      let method = '';

      if(this.isNew){
        url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
        method = 'post';
      } else {
        url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${tempCoupon.id}`;
        method = 'put';
      }

      try{
        const res = await axios({
          method,
          url,
          headers: { Authorization: token, 'Content-Type':'application/json'},
          data: { data: tempCoupon }
        });

        if(res.data.success){
          this.$httpMessageState(res, this.isNew ? '新增優惠券' : '編輯優惠券');
          this.getCoupons();
          this.$refs.couponModal.hideModal();
        } else {
          alert(res.data.message || '操作失敗');
        }
      } catch(err){
        console.error(err);
        alert('操作發生錯誤');
      }
    },

    async delCoupon(item) {
      const token = Cookies.get('token'); // ⚠️ 確保小寫一致
      const confirmDel = confirm(`確定要刪除優惠券 "${item.title}" 嗎？`);
      if(!confirmDel) return;

      this.isLoad = true;
      try {
        const res = await axios.delete(
          `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${item.id}`,
          { headers: { Authorization: token, 'Content-Type':'application/json'} }
        );
        if(res.data.success){
          alert('刪除成功');
          this.getCoupons();
        } else {
          alert(res.data.message || '刪除失敗');
        }
      } catch(err){
        console.error(err);
        alert('刪除發生錯誤');
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
