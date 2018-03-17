import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component (resolve) {
        require.ensure(['../views/homePage.vue'], () => {
          resolve(require('../views/homePage.vue'))
        })
      }
    },
    {
      path: '/index/addMdIndex',
      name: 'addMdIndex',
      component (resolve) {
        require.ensure(['../views/addMdIndex.vue'], () => {
          resolve(require('../views/addMdIndex.vue'))
        })
      }
    },
    {
      path: '/index/modifiedIndex/:userId/:mdIndex/:mdName',
      name: 'modifiedIndex',
      component (resolve) {
        require.ensure(['../views/modifiedIndex.vue'], () => {
          resolve(require('../views/modifiedIndex.vue'))
        })
      }
    },
    {
      path: '*',
      redirect: { name: 'index' }
    }
  ]
  // scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { x: 0, y: 0 }
  //   }
  // }
})
router.beforeEach((to, from, next) => {
  console.log('从' + from.name + '进入' + to.name)
  next()
})
export default router
