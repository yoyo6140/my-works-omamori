<template>
  <div id="heroCarousel" class="carousel slide hero-carousel" data-bs-ride="carousel" data-bs-interval="2000">
    <div class="carousel-inner hero-carousel-inner">
      <div
        class="carousel-item hero-carousel-item"
        v-for="(slide, index) in slides"
        :class="{ active: index === 0 }"
        :key="index"
      >
        <img :src="slide.image" class="hero-carousel-img" :alt="slide.alt">
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  </div>
</template>

<script>
export default {
  name: "HeroCarousel",
  data() {
    return {
      slides: [
        { image: './images/slide1.png', alt: '御守1', title: '祈願平安' },
        { image: './images/slide2.png', alt: '御守2', title: '幸福常伴' },
        { image: './images/slide3.png', alt: '御守3', title: '日本神社' }
      ]
    }
  }
}
</script>

<style scoped>
/* 固定高度，換圖時版面不跳；圖片以 cover 置中裁切 */
.hero-carousel {
  width: 100%;
  height: min(420px, 45vh);
  overflow: hidden;
}

.hero-carousel-inner {
  height: 100%;
}

.hero-carousel-item {
  height: 100%;
}

.hero-carousel-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
