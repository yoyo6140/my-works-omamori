<template>
  <!-- 🔹 上方輕量頂欄 -->
  <div class="top-bar d-flex justify-content-end p-2 ">
    <router-link to="/admin/products" class="primary me-2">
      管理登入
    </router-link>
    <router-link :to="{name:'CallMe'}" class="secondary">
      聯絡我們
    </router-link>
  </div>

  <!-- 🔹 主 navbar -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" :to="{ name: 'MyHome' }">
        <img src="logo.png" alt="Logo" width="30" class="d-inline-block align-text-top">
        御守屋
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><router-link class="nav-link" :to="{name:'MyHome'}">首頁</router-link></li>
          <li class="nav-item"><router-link class="nav-link" :to="{name:'UserGoods'}">商品</router-link></li>
          <li class="nav-item"><router-link class="nav-link" :to="{name:'UserCarts'}">購物車</router-link></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'MyNavbar'
}
</script>

<style scoped>
.top-bar {
  border-bottom: 1px solid #e0e0e0; /* 可選：加分隔線 */
}

a {
  text-decoration: none; /* 移除底線 */
}

</style>
