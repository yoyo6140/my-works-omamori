<template>
  <nav aria-label="Page navigation example" v-if="pages && pages.total_pages > 0">
    <ul class="pagination justify-content-center">
      <!-- 上一頁 -->
      <li class="page-item" :class="{ disabled: pages.current_page <= 1 }">
        <a class="page-link" href="#" @click.prevent="updatePage(pages.current_page - 1)">
          &laquo;
        </a>
      </li>

      <!-- 頁碼 -->
      <li class="page-item" 
          v-for="page in pages.total_pages" 
          :key="page"
          :class="{ active: page === pages.current_page }">
        <a class="page-link" href="#" @click.prevent="updatePage(page)">{{ page }}</a>
      </li>

      <!-- 下一頁 -->
      <li class="page-item" :class="{ disabled: pages.current_page >= pages.total_pages }">
        <a class="page-link" href="#" @click.prevent="updatePage(pages.current_page + 1)">
          &raquo;
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
    name: 'MyPagination',
    props: ['pages'],
    methods: {
        updatePage(page) {
            this.$emit('emit-pages', page);
        }
    }
}
</script>