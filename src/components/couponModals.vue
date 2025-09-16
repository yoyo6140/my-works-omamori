<template>
  <div class="modal fade" id="couponModal" tabindex="-1" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">優惠券</h5>
          <button type="button" class="btn-close" @click="hideModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label>標題</label>
            <input type="text" class="form-control" v-model="tempCoupon.title">
          </div>
          <div class="mb-3">
            <label>優惠碼</label>
            <input type="text" class="form-control" v-model="tempCoupon.code">
          </div>
          <div class="mb-3">
            <label>到期日</label>
            <input type="date" class="form-control" v-model="due_date">
          </div>
          <div class="mb-3">
            <label>折扣百分比</label>
            <input type="number" class="form-control" v-model.number="tempCoupon.percent">
          </div>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox"
                   :true-value="1" :false-value="0"
                   v-model="tempCoupon.is_enabled">
            <label class="form-check-label">是否啟用</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="hideModal">關閉</button>
          <button class="btn btn-primary" @click.prevent="$emit('update-coupon', tempCoupon)">更新優惠券</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  name:'CouponModal',
  props:{ coupon:{} },
  data() {
    return {
      tempCoupon:{},
      due_date:''
    };
  },
  emits:['update-coupon'],
  mounted() {
    this.modalInstance = new Modal(this.$refs.modal, { backdrop:'static' });
  },
  watch:{
    coupon:{
      handler(newVal){
        if(!newVal) return;
        this.tempCoupon = { ...newVal };
        if(this.tempCoupon.due_date){
          this.due_date = new Date(this.tempCoupon.due_date * 1000)
            .toISOString().split('T')[0];
        }
      },
      immediate:true
    },
    due_date(newVal){
      if(newVal){
        this.tempCoupon.due_date = Math.floor(new Date(newVal)/1000);
      }
    }
  },
  methods:{
    showModal(){ 
        this.modalInstance.show(); 
    },
    hideModal(){ 

        const activeEl = document.activeElement;
        if(this.$refs.modal.contains(activeEl)) activeEl.blur();
        this.modalInstance.hide(); 
    }
  }
};
</script>
