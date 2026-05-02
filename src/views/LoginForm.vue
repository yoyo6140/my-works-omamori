<template>
  <my-navbar></my-navbar>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">管理者登入</h3>
            <form @submit.prevent="signIn">
              <div class="mb-3">
                <label for="username" class="form-label d-block text-start"
                  >帳號</label
                >
                <input
                  type="text"
                  id="username"
                  v-model="user.username"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label d-block text-start"
                  >密碼</label
                >
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="user.password"
                    class="form-control"
                    autocomplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary px-3"
                    :aria-label="showPassword ? '隱藏密碼' : '顯示密碼'"
                    :title="showPassword ? '隱藏密碼' : '顯示密碼'"
                    @click="showPassword = !showPassword"
                  >
                    <i
                      class="bi"
                      :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-100">登入</button>
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
            </form>

            <div class="mt-4 pt-3 border-top">
              <p class="small text-muted mb-2">測試用帳號（點一下就複製）</p>
              <div class="d-flex flex-column gap-2">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary text-start d-flex align-items-center justify-content-between gap-2"
                  @click="copyToClipboard(demoEmail, '已複製帳號')"
                >
                  <span>
                    <span class="text-muted">帳號</span>
                    <span class="font-monospace ms-2">{{ demoEmail }}</span>
                  </span>
                  <i class="bi bi-clipboard flex-shrink-0" aria-hidden="true"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary text-start d-flex align-items-center justify-content-between gap-2"
                  @click="copyToClipboard(demoPassword, '已複製密碼')"
                >
                  <span>
                    <span class="text-muted">密碼</span>
                    <span class="font-monospace ms-2">{{ demoPassword }}</span>
                  </span>
                  <i class="bi bi-clipboard flex-shrink-0" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyNavbar from "@/components/MyNavbar.vue";
import Cookies from 'js-cookie'
import { API } from '@/constants/api'
import { notify } from '@/components/MessageToast.vue'
export default {
  name: "LoginForm",
  components: { MyNavbar },
  data() {
    return {
      showPassword: false,
      demoEmail: "abc1425367989@gmail.com",
      demoPassword: "test1234",
      user: {
        username: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async copyToClipboard(text, successMessage) {
      try {
        await navigator.clipboard.writeText(text);
        notify.success(successMessage);
      } catch {
        notify.error("無法自動複製，請手動選取文字複製");
      }
    },
    async signIn() {
      try {
        const httpRes = await fetch(API.adminSignIn(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.user),
        })
        const res = await httpRes.json()

        if (res.success) {
          const { token, expired } = res
          Cookies.set('token', token, { expires: new Date(expired) })
          this.$router.push("/admin/products");
          notify.success('登入成功')
        } else {
          notify.error(res.message || '登入失敗')
        }
      } catch (err) {
        notify.error('網路錯誤')
      }
    },
  },
};
</script>
