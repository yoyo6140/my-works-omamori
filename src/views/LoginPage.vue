<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 shadow" style="width: 350px;">
      <h3 class="text-center mb-4">管理者登入</h3>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="username" class="form-label">帳號</label>
          <input type="text" id="username" v-model="username" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">密碼</label>
          <input type="password" id="password" v-model="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">登入</button>
      </form>
      <p class="text-danger mt-2" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: "LoginPage",
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/api/admin/login', {
          username: this.username,
          password: this.password
        });

        // 將 token 存到 cookie，7天有效
        Cookies.set('adminToken', response.data.token, { expires: 7 });

        // 導向管理者首頁
        this.$router.push('/admin');

      } catch (err) {
        if (err.response) {
          this.error = err.response.data.message;
        } else {
          this.error = '登入失敗，請稍後再試';
        }
      }
    }
  }
};
</script>

<style scoped>
/* 可以調整卡片寬度、陰影、或表單間距 */
</style>