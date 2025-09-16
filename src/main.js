import { createApp } from 'vue'
import App from './App.vue'

// 引入 Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import axios from 'axios'

// 引入 router
import router from './router'

// 建立 app 實例
const app = createApp(App)

// 加入全域方法
app.config.globalProperties.$httpMessageState = function (res, title = '更新') {
  if (res.data.success) {
    alert(`${title}成功`)
  } else {
    alert(`${title}失敗：${res.data.message}`)
  }
}
app.config.globalProperties.$http = axios

// 掛載 router 與 app
app.use(router)
app.mount('#app')
