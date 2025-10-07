<template>
  <loading-spinner v-if="isLoad" ></loading-spinner>
  <div class="container mt-4" v-else>

    <!-- 訂單列表 -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>訂購人</th>
          <th>Email</th>
          <th>付款狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user ? order.user.name : '' }}</td>
          <td>{{ order.user ? order.user.email : '' }}</td>
          <td>{{ order.is_paid ? '已付款' : '未付款' }}</td>
          <td>
            <button class="btn btn-primary btn-sm me-1" @click="openModal(order)">詳情</button>
            <button class="btn btn-danger btn-sm" @click="deleteOrder(order.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" ref="orderModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">訂單詳情</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p><strong>訂單編號：</strong> {{ selectedOrder.id }}</p>
            <p><strong>訂購人：</strong> {{ selectedOrder.user ? selectedOrder.user.name : '' }}</p>
            <p><strong>Email：</strong> {{ selectedOrder.user ? selectedOrder.user.email : '' }}</p>
            <p><strong>地址：</strong> {{ selectedOrder.user ? selectedOrder.user.address : '' }}</p>
            <p><strong>電話：</strong> {{ selectedOrder.user ? selectedOrder.user.tel : '' }}</p>
            <p><strong>留言：</strong> {{ selectedOrder.message }}</p>

            <h6>商品清單</h6>
            <ul>
              <li v-for="(prod, key) in selectedOrder.products" :key="key">
                商品ID: {{ prod.product.title }} | 數量: {{ prod.qty }}
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
          </div>
        </div>
      </div>
    </div>

  </div>
  <my-pagination :pages="pagination" @emit-pages="getOrders"></my-pagination>
</template>

<script>
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import Cookies from 'js-cookie';
import MyPagination from '@/components/MyPagination.vue';

export default {
  name:'AdminOrders',
  components:{MyPagination,LoadingSpinner},
  emits:['update-product'],
  data() {
    return {
      isLoad: true,
      orders: [],
      selectedOrder: {
        user: {},
        products: [],
        message: '',
        is_paid: false,
        id: ''
      },
      modalInstance: null,
      pagination:{},
    };
  },
  methods: {
    // 取得訂單
    async getOrders(page = 1) {
      this.isLoad = true;
      try {
        const token = Cookies.get('token') || '';

        const res = await axios.get(
          `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders/?page=${page}`, {
          headers: { Authorization: token }
        });

        if (res.data.success) {
          this.orders = res.data.orders;
          this.pagination = res.data.pagination;
        } else {
          alert(res.data.message || "取得訂單失敗");
        }
      } catch (err) {
        alert("網路錯誤");
      } finally {
        this.isLoad = false;
      }
    },

    // 刪除訂單
    async deleteOrder(orderId) {
      if (!confirm('確定要刪除此訂單嗎？')) return;

      try {
        const token = Cookies.get('token') || '';
        const res = await axios.delete(`${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${orderId}`, {
          headers: { Authorization: token }
        });

        if (res.data.success) {
          alert('刪除成功');
          // 刪除成功後重新取得訂單
          this.getOrders();
        } else {
          alert(res.data.message || '刪除失敗');
        }
      } catch (err) {
        alert('網路錯誤，刪除失敗');
      }
    },

    openModal(order) {
      this.selectedOrder = order;
      if (!this.modalInstance) {
        this.modalInstance = new Modal(this.$refs.orderModal);
      }
      this.modalInstance.show();
    },

    closeModal() {
      if (this.modalInstance) this.modalInstance.hide();
      document.activeElement.blur();
    }
  },
  created() {
    this.getOrders();
  }
};
</script>
