<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <div class="container-fluid">
      <router-link :to="{name:'MyHome'}" class="navbar-brand fw-bold">
      <img src="logo.png" alt="Logo" width="30" class="d-inline-block align-text-top">
      御守屋 Omamori
    </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
            <li class="nav-item"><router-link class="nav-link" :to="{name: 'AdminProducts' }">產品</router-link></li>
            <li class="nav-item"><router-link class="nav-link" :to="{name:'AdminOrders'}">訂單</router-link></li>
            <li class="nav-item"><router-link class="nav-link" :to="{name:'AdminCoupons'}">優惠券</router-link></li>
            <li class="nav-item"><router-link class="nav-link" :to="{name:'CallMe'}">聯繫我們</router-link></li>
            <li class="nav-item">
                <a href="#" class="nav-link" @click.prevent="logout">登出</a>
            </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name:'MyNavbar',
     methods: {
        logout() {
            Cookies.remove('token')
            this.$router.push('/login')
        }
    }

}
</script>

<style>
nav.navbar {
  padding-top: 1rem;    /* 上方內距 */
  padding-bottom: 1rem; /* 下方內距 */
  margin-bottom: 20px;
}


</style>