import Vue from 'vue'
import Router from 'vue-router'
import goods from '../components/goods/goods.vue'
import ratings from '../components/ratings/ratings'

Vue.use(Router)

export default new Router({
  mode:'history',
  base:process.env.BASE_URL,
  routes: [
    {
      path:'/goods',
      name:'goods',
      component:goods,
      meta:{requireAuth:true}
    },
    // {
    //   path:'/ratings/:cart',
    //   name:'ratings',
    //   component:ratings,
    //   meta:{requireAuth:true}
    // },
    {
      path:'/ratings',
      name:'ratings',
      component:ratings,
      meta:{requireAuth:true}
    },
    {
      path:'/carthistory',
      name:'carthistory',
      component:() => import('../components/user/carthistory.vue'),
      meta:{requireAuth:true}
    },
    {
      path:'/userMain',
      name:'userMain',
      component:() => import('../components/user/userMain.vue'),
      meta:{requireAuth:true}
    },
    {
      path:'/login',
      name:'login',
      component:() => import('../components/user/login.vue'),
    
    },
    {
      path:'/toReg',
      name:'toReg',
      component:() => import('../components/user/register.vue'),
     
    },
  ]
})
