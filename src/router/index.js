import Vue from 'vue'
import Router from 'vue-router'
import Closebuy from '@/pages/Closebuy'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      name: 'Closebuy',
      component: Closebuy
    }
  ]
})
