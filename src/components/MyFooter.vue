<template>
  <footer class="bg-dark text-white py-4 mt-5">
    <div class="container text-center">
      <p class="mb-1">© 2025 御守屋 Omamori | 祈福與守護</p>
      <p>本網站為個人學習與作品展示用途所建立，內容以日本神社文化與御守為主題，用於呈現前端設計與網頁開發能力。</p>
      
      <div class="mb-1 ">
        <p class="mb-0">本網站所呈現的商品與圖片僅為示範使用，並非真實販售行為，所有圖片與素材若涉及版權，僅用於教育與作品展示目的，未作商業用途。</p>
      </div>
      
    </div>
  </footer>
</template>


<script>
export default {
    name:'MuFooter'

}
</script>

<style>
.floating-login {
  position: absolute;  /* 相對於 footer */
  bottom: 15px;        /* 距離 footer 底部 */
  right: 15px;         /* 距離 footer 右側 */
  z-index: 1000;
  border-radius: 50px;
  padding: 5px 15px;
}



</style>