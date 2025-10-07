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
                <input
                  type="password"
                  id="password"
                  v-model="user.password"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">登入</button>
              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MyNavbar from "@/components/MyNavbar.vue";
export default {
  name: "LoginForm",
  components: { MyNavbar },
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async signIn() {
      const api = `${process.env.VUE_APP_API}admin/signin`;
      try {
        const res = await axios.post(api, this.user);
        if (res.data.success) {
          const { token, expired } = res.data;
          document.cookie = `token=${token}; expires=${new Date(
            expired
          ).toUTCString()}; path=/`;
          this.$router.push("/admin/products");
          alert("登入成功");
        } else {
          alert(res.data.message || "登入失敗");
        }
      } catch (err) {
        alert("網路錯誤");
      }
    },
  },
};
</script>
