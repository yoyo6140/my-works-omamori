<template>
  <!-- Button trigger modal -->
  <button 
    type="button" 
    class="btn btn-primary" 
    @click="showModal"
  >
    新增產品
  </button>

  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"  ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">新增產品</h5>
          <button type="button" class="btn-close" @click="hideModal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="image" class="form-label">輸入圖片網址</label>
                <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結"  v-model="tempProduct.image">
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label">或 上傳圖片
                  <i class="fas fa-spinner fa-spin"></i>
                </label>
                <input 
                  type="file" 
                  id="customFile" 
                  class="form-control"
                  ref="fileInput"
                  @change="uploadFile"
                  >
              </div>
              <img class="img-fluid" alt="">

              <!-- 延伸技巧，多圖 -->
              <div class="mt-5">
                <button class="btn btn-outline-primary btn-sm d-block w-100">新增圖片</button>
              </div>
            </div>

            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input type="text" class="form-control" id="title" placeholder="請輸入標題"  v-model="tempProduct.title">
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input type="text" class="form-control" id="category" placeholder="請輸入分類"  v-model="tempProduct.category">
                </div>
                <div class="mb-3 col-md-6">
                  <label for="unit" class="form-label">單位</label>
                  <input type="text" class="form-control" id="unit" placeholder="請輸入單位" v-model="tempProduct.unit">
                </div>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價" v-model.number="tempProduct.origin_price">
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input type="number" class="form-control" id="price" placeholder="請輸入售價" v-model.number="tempProduct.price">
                </div>
              </div>

              <hr>

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea class="form-control" id="description" placeholder="請輸入產品描述"  v-model="tempProduct.description"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea class="form-control" id="content" placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
              </div>
              <div class="mb-3 form-check">
                <input class="form-check-input" type="checkbox" :true-value="1" :false-value="0" id="is_enabled" v-model="tempProduct.is_enabled">
                <label class="form-check-label" for="is_enabled"  >是否啟用</label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="hideModal">取消</button>
          <button type="button" class="btn btn-primary" @click="confirmProduct">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min';
// import modalMixin from '../mixins/modalMinxin';
import axios from 'axios';
import Cookies from 'js-cookie'

export default {
    name:'ProductModal',
    // mixins: [modalMixin],
    props:{
        product:{
            type:Object,
            default() {
              return {}
            }
        },
        isNew: { 
          type: Boolean, 
          default: true 
        } // 新增模式默認 true 用來防止編輯產品時 要求要上傳圖片
    },
    watch: {
        product() {
            this.tempProduct = this.product
            }
        },
    emits: ['update-product'], 
    data() {
        return {
            modal:{},
            tempProduct:{}
        }
    },

    methods:{
       confirmProduct() {
        if (this.isNew && !this.tempProduct.image) {
          alert('新增時必須上傳圖片'); 
          return; // 前面 新增時候 要有圖片 編輯時候確定有無圖片
        }
        this.$emit('update-product', this.tempProduct)
        this.hideModal()
      },
 
      showModal() {
        this.modal.show()
        
      },
        hideModal() {
        const activeEl = document.activeElement;
        if (this.$refs.modal.contains(activeEl)) {
          activeEl.blur(); // 取消 focus
        }
        this.modal.hide()

      },
        async uploadFile() {
        const uploadFile = this.$refs.fileInput.files[0]
        const formData = new FormData()
        formData.append('file-to-upload', uploadFile)
        try {
          const token =  Cookies.get('hexToken') // 同上
          const apiPath = 'yusei-api'
          const res = await axios.post(
            `https://vue3-course-api.hexschool.io/api/${apiPath}/admin/upload`,
            formData,
            {
              headers: {
                Authorization: token,
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          if (res.data.success) {
            console.log('檔案上傳成功', res.data.imageUrl)
            // 將上傳結果存到 tempProduct.image
            this.tempProduct.image = res.data.imageUrl
          } else {
            alert(res.data.message || '檔案上傳失敗')
            console.warn(res.data)  // 印出回傳內容方便除錯
          }
        } catch (err) {
          console.error(err)
          alert('上傳發生錯誤')
        }
      }
    },
    mounted() {
        this.modal = new Modal(this.$refs.modal)

    }
}
</script>

<style>
.form-label,.form-check-label {
  width: 100%;
  text-align: left;
}

</style>