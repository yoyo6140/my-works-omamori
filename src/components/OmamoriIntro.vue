<template>
  <section class="bg-light">
    <div class="container py-5">

      <h2 class="text-center mb-5">日本神社與御守文化</h2>

      <!-- 第一部分：神社介紹 (圖片左，文字右) -->
      <div class="row align-items-center mb-5">
        <div class="col-md-6 mb-4 mb-md-0">
          <img :src="require('@/assets/omamoriinfo-1.png')" class="img-fluid rounded shadow-sm" alt="日本神社">
        </div>
        <div class="col-md-6">
          <h4 class="mb-3">神社介紹</h4>
          <p>日本神社是日本文化中重要的宗教場所，供奉各種神明。神社建築通常具有鳥居、社殿、參道等特色，是民眾祈福、求平安的重要場所。每年新年或節慶，神社都會吸引大量民眾前來參拜，感受傳統文化氛圍。</p>
        </div>
      </div>

      <!-- 第二部分：參拜文化 (文字左，圖片右) -->
      <div class="row align-items-center mb-5">
        <div class="col-md-6 order-md-2 mb-4 mb-md-0">
          <img :src="require('@/assets/omamoriinfo-2.png')" class="img-fluid rounded shadow-sm" alt="參拜">
        </div>
        <div class="col-md-6 order-md-1">
          <h4 class="mb-3">參拜文化</h4>
          <p>參拜神社是日本文化中重要的宗教活動。</p>
          <p>在參拜過程中，許多人會購買御守作為護身符，將祝福帶回家中或隨身攜帶，使祈福儀式更完整，也與神社文化密切連結。</p>
        </div>
      </div>

      <!-- 第三部分：御守(圖片左，文字右) -->
      <div class="row align-items-center mb-5">
        <div class="col-md-6 mb-4 mb-md-0">
          <img :src="require('@/assets/omamoriinfo-3.png')" class="img-fluid rounded shadow-sm" alt="御守">
        </div>
        <div class="col-md-6">
          <h4 class="mb-3">御守（お守り）</h4>
          <p>每個御守都有其專屬祝福與象徵意義，人們會依據自己的需求挑選不同種類的御守，帶回家或隨身攜帶以祈福護身。</p>
          <p>御守設計精美，材質多樣，常作為紀念品或禮物贈送親友，寄託祝福與心意，與參拜文化形成密切呼應。</p>
        </div>
      </div>

    </div>
  </section>
</template>

<script>
export default {
  name: "OmamoriCulture"
}
</script>

<style scoped>
img {
  max-width: 500px;
  max-height: 300px;
  
  object-fit: cover;
}
</style>
