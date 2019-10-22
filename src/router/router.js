import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/user/users.vue'
import Right from '@/views/right/right.vue'
import Roles from '@/views/right/roles.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'
import Params from '@/views/goods/params.vue'
import Reports from '@/views/reports.vue'
Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }, {
      name: 'login',
      path: '/',
      redirect: { name: 'login' }
    }, {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        }, {
          name: 'users',
          path: 'users',
          component: Users
        }, {
          name: 'rights',
          path: 'rights',
          component: Right
        }, {
          name: 'roles',
          path: 'roles',
          component: Roles
        }, {
          name: 'goods',
          path: 'goods',
          component: Goods,
          redirect: { name: 'list' },
          children: [
            {
              name: 'list',
              path: 'list',
              component: List
            },
            {
              name: 'add',
              path: 'add',
              component: Add
            }
          ]
        }, {
          name: 'params',
          path: 'params',
          component: Params
        }, {
          name: 'reports',
          path: 'reports',
          component: Reports
        }
      ]
    }
    // {
    //   name: 'test',
    //   path: '/test',
    //   component: () => import('@/views/test.vue')
    // }
  ]
})
