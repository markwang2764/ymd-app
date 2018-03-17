import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component (resolve) {
        require.ensure(['../views/cart.vue'], () => {
          resolve(require('../views/cart.vue'))
        })
      }
    },
    {
      path: '/serve/:id',
      name: 'serveType',
      component (resolve) {
        require.ensure(['../views/serveType.vue'], () => {
          resolve(require('../views/serveType.vue'))
        })
      }
    },
    {
      path: '/serve/:id/payMent',
      name: 'payMent',
      component (resolve) {
        require.ensure(['../views/payMent.vue'], () => {
          resolve(require('../views/payMent.vue'))
        })
      }
    },
    {
      path: '*',
      redirect: { name: 'index' }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => {
  console.log('从' + from.name + '进入' + to.name)
  next()
})
export default router
