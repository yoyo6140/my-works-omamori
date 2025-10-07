// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Cookies from 'js-cookie'

// 匯入各頁面元件
import MyHome from '@/views/MyHome.vue'
import LoginForm from '@/views/LoginForm.vue'
import DashBoard from '@/views/DashBoard.vue'
import AdminProducts from '@/views/AdminProducts.vue'
import AdminOrders from '@/views/AdminOrders.vue'
import AdminCoupons from '@/views/AdminCoupons.vue'
import CallMe from '@/views/CallMe.vue'
import UserGoods from '@/views/UserGoods.vue'
import UserCarts from '@/views/UserCarts.vue'
import UserProduct from '@/views/UserProduct.vue'
import UserCheckout from '@/views/UserCheckout.vue'

const routes = [
    {
      path:'/home',
      name:'MyHome',
      component:MyHome,
    },
    {
      path:'/login',
      name:'LoginForm',
      component:LoginForm
    },
    {
      path:'/admin',
      name:'DashBoard',
      component:DashBoard,
      children:[
        {
          path:'products',
          name:'AdminProducts',
          component:AdminProducts,
          meta: { requiresAuth: true },
        },
        {
          path:'orders',
          name:'AdminOrders',
          component:AdminOrders,
          meta: { requiresAuth: true }
        },
        {
          path:'coupons',
          name:'AdminCoupons',
          component:AdminCoupons,
          meta: { requiresAuth: true }
        },
      ]

    },
    {
      path:'/goods',
      name:'UserGoods',
      component:UserGoods,
    },
    {
      path:'/carts',
      name:'UserCarts',
      component:UserCarts,
    },
    {
      path: '/checkout',
      name: 'UserCheckout',
      component: UserCheckout,
      props: true
    },
  
    
    {
      path: '/goods/:id',
      name: 'UserProduct',
      component: UserProduct,
    },
    
    {
      path:'/callme',
      name:'CallMe',
      component:CallMe,
    }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// ✅ router 守衛只檢查 cookie 是否存在
router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});




export default router
