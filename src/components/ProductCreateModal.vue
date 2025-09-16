<template>
  <!-- Button trigger modal -->
  <button type="button" class="btn btn-primary" @click="showModal">
    新增產品
  </button>

  <!-- Modal -->
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">新增產品</h5>
          <button type="button" class="btn-close" @click="hideModal"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <!-- 左側圖片 -->
            <div class="col-sm-4">
              <!-- 單張主圖輸入 -->
              <div class="mb-3">
                <label class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" v-model="tempProduct.imageUrl">
              </div>

              <!-- 上傳圖片 -->
              <div class="mb-3">
                <label class="form-label">或上傳圖片</label>
                <input type="file" class="form-control" ref="fileInput"  @change="uploadFile">
                <div v-if="isUploading" class="text-info mt-1">圖片上傳中...</div>
              </div>

              <!-- 顯示已上傳的多張圖片 -->
              <div v-if="tempProduct.imagesUrl && tempProduct.imagesUrl.length" class="d-flex flex-wrap gap-2 mt-1">
                <div v-for="(img, idx) in tempProduct.imagesUrl" :key="idx" class="position-relative">
                  <img :src="img" class="img-thumbnail" style="width: 100px; height: 100px; object-fit: cover;">
                  <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0"
                          @click="tempProduct.imagesUrl.splice(idx, 1)">X</button>
                </div>
              </div>

              <!-- 顯示主圖 -->
              <img v-if="tempProduct.imageUrl" :src="tempProduct.imageUrl" class="img-fluid mt-2">
            </div>

            <!-- 右側文字資訊 -->
            <div class="col-sm-8">
              <div class="mb-3">
                <label class="form-label">標題</label>
                <input type="text" class="form-control" v-model="tempProduct.title">
              </div>

              <div class="row gx-2">
                <!-- 分類下拉選單 -->
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
          <button type="button" class="btn btn-primary" @click.prevent="confirmProduct">確認新增</button>
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
    name:'ProductCreateModal',
    emits:['refresh-products'],
    data() {
        return {
            modal:null,
            tempProduct:{},
            isUploading:false
        }
    },
    watch: {
      'tempProduct.imageUrl'(val) {
        if(val) {
          this.isValidImage = true; // 按鈕可以啟用
        } else {
          this.isValidImage = false;
        }
      }
    },
    mounted() {
        this.modal = new Modal(this.$refs.modal) //建立實例 之後用這個控制
    },
    methods:{
        showModal() {
            this.modal.show() //彈出視窗
        },
        hideModal() {
            this.modal.hide() //隱藏視窗 (取消按鈕設定)
            this.tempProduct = { is_enabled: 0 };  // 重置表單資料
            this.isUploading = false;      // 如果正在上傳，也清掉
            if (this.$refs.fileInput) {
              this.$refs.fileInput.value = null;   // 清空 file input
            }
            document.activeElement.blur();
        },
        
        async confirmProduct() {
            if (!this.tempProduct.imageUrl) {
                alert('請先上傳圖片或輸入圖片網址');
                return;
            }

            try {
                const token = Cookies.get('token');
                const res = await axios.post(
                    `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`,
                    { data: this.tempProduct },
                    { headers: { Authorization: token } }
                );

                if(res.data.success) {
                    console.log('產品資料', this.tempProduct)
                    this.hideModal()
                    this.$emit('refresh-products')
                    this.tempProduct = {is_enabled: 0 }
                } else {
                    alert(res.data.message)
                    console.log(res)
                    }
                    
                } 
            catch(err) {
                console.error(err);
                alert('新增產品失敗');
            }
        },
        async uploadFile() {
          const file = this.$refs.fileInput.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append('file-to-upload', file);
          this.isUploading = true

          try {
            // 從 cookie 拿 token
            const token = Cookies.get('token');
            if (!token) {
              alert('尚未登入或登入過期');
              this.$router.push('/admin/signin');
              return;
            }
            const res = await axios.post(
              `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/upload`,
              formData,
              { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } }
            );

            if (res.data.success) {
              this.tempProduct.imageUrl = res.data.imageUrl; // 上傳成功後存入 tempProduct
            } else {
              alert(res.data.message || '檔案上傳失敗');
            }
          } catch (err) {
            console.error(err);
            alert('上傳圖片失敗');
          }finally {
            this.isUploading = false
          }
        }
                
        

            
        
    }
}
</script>

<style scoped>
.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

/* 標題靠左，按鈕靠右 */
::v-deep(.form-label) {
  display: flex;             /* 確保 flex */
  justify-content: flex-start; /* 標題靠左 */
  align-items: center;       /* 垂直置中 */
}


</style>