<template>
  <my-navbar></my-navbar>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-8">
        <!-- 🔹 三步驟圓形顯示 -->
        <div class="stepper">
          <div :class="['step', step >= 1 ? 'active' : '', step > 1 ? 'done' : '']">
            <div class="circle">1</div>
            <div class="label">訂單確認</div>
          </div>
          <div :class="['step', step >= 2 ? 'active' : '', step > 2 ? 'done' : '']">
            <div class="circle">2</div>
            <div class="label">金流付款</div>
          </div>
          <div :class="['step', step >= 3 ? 'active' : '', step === 3 ? 'done' : '']">
            <div class="circle">3</div>
            <div class="label">付款成功</div>
          </div>
        </div>

        <!-- Step 1：訂單確認 -->
        <div v-if="step === 1" class="mt-4">
          <h3>訂單確認</h3>
          <table class="table">
            <thead>
              <tr>
                <th>商品</th>
                <th>單價</th>
                <th>數量</th>
                <th>小計</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.carts" :key="item.id">
                <td>{{ item.product?.title }}</td>
                <td>{{ item.product?.price || item.product?.origin_price }}</td>
                <td>{{ item.qty }}</td>
                <td>{{ item.final_total || (item.product?.price * item.qty) }}</td>
              </tr>
            </tbody>
          </table>
          <h5 class="text-end">總計：NT {{ order?.total || 0 }} 元</h5>

          <!-- 結帳表單 -->
          <div class="my-5 row justify-content-center text-start">
            <Form class="col-md-6" @submit="createOrder" v-slot="{ errors }">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <Field id="email" name="email" type="email" class="form-control"
                       :class="{ 'is-invalid': errors['email'] }"
                       placeholder="請輸入 Email" rules="email|required"
                       v-model="form.user.email"></Field>
                <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
              </div>

              <div class="mb-3">
                <label for="name" class="form-label">收件人姓名</label>
                <Field id="name" name="name" type="text" class="form-control"
                       :class="{ 'is-invalid': errors['name'] }"
                       placeholder="請輸入姓名" rules="required"
                       v-model="form.user.name"></Field>
                <ErrorMessage name="name" class="invalid-feedback"></ErrorMessage>
              </div>

              <div class="mb-3">
                <label for="tel" class="form-label">收件人電話</label>
                <Field id="tel" name="tel" type="tel" class="form-control"
                       :class="{ 'is-invalid': errors['tel'] }"
                       placeholder="請輸入電話" rules="required"
                       v-model="form.user.tel"></Field>
                <ErrorMessage name="tel" class="invalid-feedback"></ErrorMessage>
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">收件人地址</label>
                <Field id="address" name="address" type="text" class="form-control"
                       :class="{ 'is-invalid': errors['address'] }"
                       placeholder="請輸入地址" rules="required"
                       v-model="form.user.address"></Field>
                <ErrorMessage name="address" class="invalid-feedback"></ErrorMessage>
              </div>

              <div class="mb-3">
                <label for="message" class="form-label">留言</label>
                <textarea id="message" class="form-control" cols="30" rows="5"
                          v-model="form.message"></textarea>
              </div>

              <div class="text-end">
                <button type="submit" class="btn btn-primary">前往付款</button>
              </div>
            </Form>
          </div>
        </div>

        <!-- Step 2：金流付款 -->
        <div v-if="step === 2" class="mt-4">
          <h3>金流付款</h3>
          <div class="my-5 row justify-content-center">
            <form class="col-md-6" @submit.prevent="payOrder">
              <table class="table align-middle">
                <thead>
                <th>品名</th>
                <th>數量</th>
                <th>單價</th>
                </thead>
                <tbody>
                <tr v-for="(item, key) in order.products || {}" :key="key">
                  <td>{{ item.product?.title }}</td>
                  <td>{{ item.qty }}</td>
                  <td class="text-end">{{ item.final_total || (item.product?.price * item.qty) }}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="2" class="text-end">總計</td>
                  <td class="text-end">{{ order?.total || 0 }}</td>
                </tr>
                </tfoot>
              </table>

              <table class="table">
                <tbody>
                <tr>
                  <th width="100">Email</th>
                  <td>{{ order.user?.email }}</td>
                </tr>
                <tr>
                  <th>姓名</th>
                  <td>{{ order.user?.name }}</td>
                </tr>
                <tr>
                  <th>收件人電話</th>
                  <td>{{ order.user?.tel }}</td>
                </tr>
                <tr>
                  <th>收件人地址</th>
                  <td>{{ order.user?.address }}</td>
                </tr>
                <tr>
                  <th>付款狀態</th>
                  <td>
                    <span v-if="!order.is_paid">尚未付款</span>
                    <span v-else class="text-success">付款完成</span>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="text-end" v-if="order.is_paid === false">
                <button class="btn btn-danger">確認付款去</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Step 3：付款成功 -->
        <div v-if="step === 3" class="text-center py-5">
          <h2 class="text-success">付款成功！</h2>
          <p>感謝您的購買，訂單已成立。</p>

          <!-- 訂單明細 -->
          <div class="container mt-4">
            <h4>訂單明細</h4>
            <table class="table">
              <thead>
                <tr>
                  <th>商品</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>小計</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, key) in order.products || {}" :key="key">
                  <td>{{ item.product?.title }}</td>
                  <td>{{ item.product?.price || item.product?.origin_price }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.final_total || (item.product?.price * item.qty) }}</td>
                </tr>
              </tbody>
            </table>
            <h5 class="text-end">總計：NT {{ order?.total || 0 }} 元</h5>

            <!-- 收件人資訊 -->
            <div class="mt-4">
              <h5>收件人資訊</h5>
              <table class="table">
                <tbody>
                  <tr>
                    <th width="120">Email</th>
                    <td>{{ order.user?.email }}</td>
                  </tr>
                  <tr>
                    <th>姓名</th>
                    <td>{{ order.user?.name }}</td>
                  </tr>
                  <tr>
                    <th>電話</th>
                    <td>{{ order.user?.tel }}</td>
                  </tr>
                  <tr>
                    <th>地址</th>
                    <td>{{ order.user?.address }}</td>
                  </tr>
                  <tr v-if="order.message">
                    <th>留言</th>
                    <td>{{ order.message }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="text-center mt-4">
              <router-link to="/goods" class="btn btn-outline-primary">回到商店</router-link>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
import * as AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import Cookies from 'js-cookie'
import MyNavbar from '@/components/MyNavbar.vue';

export default {
  name:'UserCheck',
  components: {  MyNavbar,Form, Field, ErrorMessage },
  data() {
    return {
      order: { 
      },
      step: 1,
      form: {
        user: {},
        message: ''
      }
    }
  },
  methods: {
     createOrder() {
      this.order.user = { ...this.form.user };
      this.order.message = this.form.message;

      // Step1 送出訂單 API
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`;
      this.$http.post(url, { data: this.order })
        .then(res => {
          console.log('Step 1 API 回傳:', res.data);

          if (res.data.success) {
            const orderId = res.data.orderId;

            // ✅ 再呼叫一次完整訂單 API
            const detailUrl = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order/${orderId}`;
            this.$http.get(detailUrl)
              .then(detailRes => {
                console.log('完整訂單資料:', detailRes.data);
                
                // 把完整訂單資料指派給 this.order
                this.order = detailRes.data.order;

                // 跳到 Step2
                this.step = 2;
              });
          } else {
            alert('建立訂單失敗，請稍後再試');
          }
        })
        .catch(err => {
          console.error(err);
          alert('送出訂單時發生錯誤');
        });
    },
    payOrder() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/pay/${this.order.id}`;
      this.$http.post(url).then(res => {
        if (res.data.success) {
          this.order.is_paid = true;
          this.step = 3;
        }
      });
    }
  },
  created() {
    // 初始化 cookie 資料
    const cartData = Cookies.get('checkoutCart');
    if (cartData) {
      const parsed = JSON.parse(cartData);
      this.order = {
        ...this.order,
        ...parsed,
        user: { ...this.order.user, ...(parsed.user || {}) }
      }
    }

    // vee-validate
    Object.keys(AllRules)
      .filter(rule => typeof AllRules[rule] === 'function')
      .forEach(rule => defineRule(rule, AllRules[rule]));

    configure({
      generateMessage: localize({ zh_TW: zhTW }),
      validateOnInput: true,
    });
    setLocale('zh_TW');
  }
}
</script>


<style scoped>
.stepper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}
.step .circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
  font-weight: bold;
  z-index: 1;
}
.step .label {
  margin-top: 8px;
  text-align: center;
  font-size: 0.9em;
  color: #aaa;
}
.step.active .circle {
  border-color: #007bff;
  background-color: #007bff;
  color: #fff;
}
.step.done .circle {
  background-color: #28a745;
  border-color: #28a745;
  color: #fff;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 4px;
  background-color: #ccc;
  z-index: 0;
}
.step.active:not(:last-child)::after {
  background-color: #007bff;
}
.step.done:not(:last-child)::after {
  background-color: #28a745;
}
</style>
