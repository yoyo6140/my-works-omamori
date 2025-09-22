<template>
  <!-- Modal -->
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">編輯產品</h5>
          <button type="button" class="btn-close" @click="hideModal"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <!-- 左側圖片 -->
            <div class="col-sm-4">
              <div class="mb-3">
                <label class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" v-model="tempProduct.imageUrl">
              </div>

              <div class="mb-3">
                <label class="form-label">或上傳圖片</label>
                <input type="file" class="form-control" ref="fileInput"  @change="uploadFile">
                <div v-if="isUploading" class="text-info mt-1">圖片上傳中...</div>
              </div>

              <img v-if="tempProduct.imageUrl" :src="tempProduct.imageUrl" class="img-fluid mt-2">
            </div>

            <!-- 右側文字資訊 -->
            <div class="col-sm-8">
              <div class="mb-3">
                <label class="form-label">標題</label>
                <input type="text" class="form-control" v-model="tempProduct.title">
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label class="form-label">分類</label>
                  <select class="form-select" v-model="tempProduct.category">
                    <option value="" disabled>請選擇分類</option>
                    <option value="北海道・東北（北部）">北海道・東北（北部）</option>
                    <option value="關東・中部（東中部）">關東・中部（東中部）</option>
                    <option value="近畿・中國・四國（西部）">近畿・中國・四國（西部）</option>
                    <option value="九州・沖繩（南部）">九州・沖繩（南部）</option>
                  </select>
                </div>

                <div class="mb-3 col-md-6">
                  <label class="form-label">單位</label>
                  <input type="text" class="form-control" v-model="tempProduct.unit">
                </div>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label class="form-label">原價</label>
                  <input type="number" class="form-control" v-model.number="tempProduct.origin_price">
                </div>
                <div class="mb-3 col-md-6">
                  <label class="form-label">售價</label>
                  <input type="number" class="form-control" v-model.number="tempProduct.price">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">產品描述</label>
                <textarea class="form-control" v-model="tempProduct.description"></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">說明內容</label>
                <textarea class="form-control" v-model="tempProduct.content"></textarea>
              </div>

              <div class="mb-3 form-check">
                <input class="form-check-input" type="checkbox"
                      :value="1"
                      v-model="tempProduct.is_enabled"
                      id="is_enabled">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="hideModal">取消</button>
          <button type="button" class="btn btn-primary" @click.prevent="confirmEdit">確認修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min';
import Cookies from 'js-cookie';
import axios from 'axios';

export default {
  name: 'ProductEditModal',
  props: {
    product: { 
        type: Object, 
        default: () => ({})  //selectedProduct 拷貝完原數據後 傳進來
    }
  },
  emits: ['refresh-products'],
  data() {
    return {
      modal: null,
      tempProduct: {},
      isUploading: false
    }
  },
  watch: {
    product: {
      immediate: true,
      handler(val) {
        // 如果 product 有資料就拷貝一份到 tempProduct
        if (val && Object.keys(val).length > 0) {
          this.tempProduct = { ...val };
        } 
        // 如果 product 沒資料，就初始化一個空產品
        else {
          this.tempProduct = { is_enabled: 0 };
        }
      }
    }
  },
  mounted() {
    this.modal = new Modal(this.$refs.modal);
  },
  methods: {
    showModal() { 
      this.modal.show() 
    },
    hideModal() {
      document.activeElement.blur();
      this.modal.hide();
      this.tempProduct = { is_enabled: 0 };
      this.isUploading = false;
      if(this.$refs.fileInput) this.$refs.fileInput.value = null;
    },
    async confirmEdit() {
      if(!this.tempProduct.imageUrl) {
        alert('請先上傳圖片或輸入圖片網址');
        return;
      }

      try {
        const token = Cookies.get('token');
        const res = await axios.put(
          `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`,
          { data: this.tempProduct },
          { headers: { Authorization: token } }
        );

        if(res.data.success) {
          this.hideModal();
          this.$emit('refresh-products');
        } else {
          alert(res.data.message);
        }
      } catch(err) {
        alert('修改產品失敗');
      }
    },
    async uploadFile() {
      const file = this.$refs.fileInput.files[0];
      if(!file) return;

      const formData = new FormData();
      formData.append('file-to-upload', file);
      this.isUploading = true;

      try {
        const token = Cookies.get('token');
        const res = await axios.post(
          `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`,
          formData,
          { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } }
        );

        if(res.data.success) {
          this.tempProduct.imageUrl = res.data.imageUrl;
        } else {
          alert(res.data.message || '檔案上傳失敗');
        }
      } catch(err) {
        alert('上傳圖片失敗');
      } finally {
        this.isUploading = false;
      }
    }
  }
}
</script>
