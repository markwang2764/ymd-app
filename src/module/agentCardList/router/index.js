import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/user',
      name: 'user',
      component (resolve) {
        require.ensure(['../views/user.vue'], () => {
          resolve(require('../views/user.vue'))
        })
      }
    },
    {
      path: '/company',
      name: 'company',
      component (resolve) {
        require.ensure(['../views/company.vue'], () => {
          resolve(require('../views/company.vue'))
        })
      }
    },
    {
      path: '/model',
      name: 'model',
      component (resolve) {
        require.ensure(['../views/model.vue'], () => {
          resolve(require('../views/model.vue'))
        })
      }
    },
    {
      path: '*',
      redirect: to => {
        const { query } = to
        if (query.to === 'user') {
          return { name: 'user' }
        } else if (query.to === 'company') {
          return { name: 'company' }
        } else if (query.to === 'model') {
          return { name: 'model' }
        }
      }
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
