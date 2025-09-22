<template>
  <div class="top-bar d-flex justify-content-end p-1 ">
      <router-link to="/admin/products" class="primary me-1">
        管理登入
      </router-link>
      <router-link :to="{name:'CallMe'}" class="secondary">
        聯絡我們
      </router-link>
    </div>
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

.navbar {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.top-bar {
  font-size: 10px;
}

</style>
