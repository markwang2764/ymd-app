import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: to => {
        const { query } = to
        if (query.to === 'user') {
          return { name: 'user' }
        } else if (query.to === 'company') {
          return { name: 'company' }
        } else {
          return { name: 'index' }
        }
      },
      component (resolve) {
        require.ensure(['../views/agentIndex.vue'], () => {
          resolve(require('../views/agentIndex.vue'))
        })
      }
    },
    {
      path: '/index',
      name: 'index',
      component (resolve) {
        require.ensure(['../views/agentIndex.vue'], () => {
          resolve(require('../views/agentIndex.vue'))
        })
      }
    },
    {
      path: '/index/user-agentAudit',
      name: 'user',
      component (resolve) {
        require.ensure(['../views/user-angentAudit.vue'], () => {
          resolve(require('../views/user-angentAudit.vue'))
        })
      }
    },
    {
      path: '/index/company-agentAudit',
      name: 'company',
      component (resolve) {
        require.ensure(['../views/company-angentAudit.vue'], () => {
          resolve(require('../views/company-angentAudit.vue'))
        })
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  console.log('从' + from.name + '进入' + to.name)
  next()
})
export default router
