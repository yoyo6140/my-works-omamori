<template>
  <my-navbar></my-navbar>
  <div class="container mt-5">
    <h2>聯繫我們</h2>
    <p>如果你有任何問題或建議，歡迎透過以下電子郵件與我們聯絡：</p>
    <p>
      <a href="mailto:xxxxoooo@gmail.com">xxxxoooo@gmail.com</a>
    </p>
  </div>
  <div>
    <div>    
      本作品使用圖案來自
      <p>
        https://zh.lovepik.com/graphics/png/
      </p>
    </div>
    <div>    
      本網站僅為作品，無任何營利用途，如擅自盜用，後果自負。
    </div>
  </div>
  <my-footer></my-footer>
</template>

<script>
import MyNavbar from '@/components/MyNavbar.vue';
import MyFooter from '@/components/MyFooter.vue';
export default {
  name: "ContactUs",
  components:{MyNavbar,MyFooter}
};
</script>
