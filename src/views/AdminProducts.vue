<template>
  <loading-spinner v-if="isLoad" ></loading-spinner>

  <div class="container" v-else>
  <div class="text-end">
    <product-create-modal @refresh-products="getProducts()"></product-create-modal>
  </div>
  
  <div class="container mt-4">
    <h3 class="mb-3">產品清單</h3>

    <!-- 桌機版：表格 (md 以上) -->
    <table class="table align-middle d-none d-md-table">
      <thead class="table-light">
        <tr>
          <th width="120">圖片</th>
          <th>分類</th>
          <th>產品名稱</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="120">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>
            <img
              :src="item.imageUrl"
              alt="產品圖片"
              class="img-thumbnail"
              style="width: 100px; height: auto;"
            />
          </td>
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">{{ item.price }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-outline-primary btn-sm" @click="openEdit(item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="deleteProduct(item.id)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 平板 + 手機版：卡片 手機單欄 col-12 平板兩欄 col-sm-6 -->
    <div class="row d-md-none g-3">
      <div
        v-for="item in products"
        :key="item.id"
        class="col-12 col-sm-6" 
      >
        <div class="card shadow-sm h-100">
          <img
            :src="item.imageUrl"
            class="card-img-top product-img"
            alt="產品圖片"
          />
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted">{{ item.category }}</h6>
            <h5 class="card-title">{{ item.title }}</h5>
            <p class="fw-bold text-danger">售價：{{ item.price }}</p>
          </div>
          <div class="card-footer text-center">
            <span class="badge bg-success" v-if="item.is_enabled">啟用</span>
            <span class="badge bg-secondary" v-else>未啟用</span>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button @click="openEdit(item)">編輯</button>
            <button @click="deleteProduct(item.id)">刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <product-edit-modal
      ref="editModal"
      :product="selectedProduct"
      @refresh-products="getProducts()">
    </product-edit-modal>
  </div>
  <MyPagination :pages="pagination" @emit-pages="getProducts"></MyPagination>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ProductCreateModal from "@/components/ProductCreateModal.vue";
import ProductEditModal from "@/components/ProductEditModal.vue";
import MyPagination from "@/components/MyPagination.vue";
import { API, adminHeaders } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'
export default {
  name: "ProductList",
  components:{LoadingSpinner,ProductCreateModal,ProductEditModal,MyPagination},
  data() {
    return {
      isLoad: true,
      products: [],
      pagination:{},
      selectedProduct: {}
    };
  },
  methods: {
    async getProducts(page = 1) {
      this.isLoad = true;
      try {
        const httpRes = await fetch(API.adminProducts(page), {
          headers: adminHeaders(),
        })
        const res = await httpRes.json()

        if (res.success) {
          this.products = res.products
          this.pagination = res.pagination
        } else {
          notify.error(res.message || '取得產品失敗')
        }
      } catch (err) {
        notify.error('網路錯誤')
      } finally {
        this.isLoad = false;
      }
    },
    openEdit(item) {
      this.selectedProduct = { ...item };        // 複製產品資料給 Modal
      this.$refs.editModal.showModal();          // 彈出編輯 Modal
    },
    async deleteProduct(id) {
      const isConfirm = confirm('確定要刪除這個產品嗎？');
      if (!isConfirm) return;

      try {
        const httpRes = await fetch(API.adminProduct(id), {
          method: 'DELETE',
          headers: adminHeaders(),
        })
        const res = await httpRes.json()

        if (res.success) {
          notify.success('刪除成功')
          this.getProducts(); // 刪除後重新取得產品列表
        } else {
          notify.error(res.message || '刪除失敗')
        }
      } catch (err) {
        notify.error('網路錯誤，刪除失敗')
      }
    }
  },
  created() {
    this.getProducts();
  },
};
</script>

<style>
.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover; /* 保持比例，超出部分裁切 */
  border-radius: 8px;
}
</style>
