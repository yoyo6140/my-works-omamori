import { createApp } from 'vue'
import App from './App.vue'

// 引入 Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 引入 router
import router from './router'

// 建立 app 實例
const app = createApp(App)

// 掛載 router 與 app
app.use(router)
app.mount('#app')
