<template>
  <div id="heroCarousel" class="carousel slide hero-carousel" data-bs-ride="carousel" data-bs-interval="2000">
    <div class="carousel-inner">
      <div class="carousel-item" v-for="(slide, index) in slides" :class="{ active: index === 0 }" :key="index">
        <img :src="slide.image" class="d-block w-100" :alt="slide.alt">
        <div class="carousel-caption d-none d-md-block">
          <h5>{{ slide.title }}</h5>
          <p>{{ slide.subtitle }}</p>
        </div>
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
        { image: '/images/slide1.png', alt: '御守1', title: '祈願平安', subtitle: '挑選專屬於你的御守' },
        { image: '/images/slide2.png', alt: '御守2', title: '幸福常伴', subtitle: '守護你的每一天' },
        { image: '/images/slide3.png', alt: '御守3', title: '日本神社', subtitle: '感受傳統文化' }
      ]
    }
  }
}
</script>

<style>
.hero-carousel {
  max-height: 600px;       /* 限制幻燈片最大高度 */
  overflow: hidden;        /* 超出部分隱藏 */
}

.hero-carousel img {
  width: 100%;             /* 撐滿寬度 */
  height: 100%;            /* 撐滿容器高度 */
  object-fit: cover;       /* 保持比例，自動裁切 */
}
</style>
