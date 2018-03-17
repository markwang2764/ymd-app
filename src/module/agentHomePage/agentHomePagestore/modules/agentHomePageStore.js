
import * as types from '../types.js'
import {_fetchAgentHomePage} from '../api'

const state = {
  AgentHomePage: {},
  _info: {},
  _users: [],
  _scope: [],
  _title: '',
  _code: '',
  _msg: ''
}

const actions = {
  fetchAgentHomePage ({ commit }, data) {
    _fetchAgentHomePage(data)
    .then(res => commit(types.SET_DATA, res))
  }
}
const getters = {
  AgentHomePageData (state) {
    return state.AgentHomePage
  },
  info (state) {
    return state._info
  },
  users (state) {
    return state._users
  },
  scope (state) {
    return state._scope
  },
  title (state) {
    return state._title
  },
  code (state) {
    return state._code
  },
  msg (state) {
    return state._msg
  }
}
const mutations = {

  [types.SET_DATA] (state, res) {
    let data = res.data
    let code = res.code
    state.AgentHomePage = data
    state._code = code
    if (code === '-9') {
      state._msg = '用户不存在'
    }
    state._users = data.company_users
    if (state.AgentHomePage.company_verify === '1') {
      state._info = data.company
      state._scope = data.company.company_scope
      state._title = data.company.company_name
    } else {
      state._scope = data.user_info.user_scope
      state._info = data.user_info
      state._title = data.job
    }
  }

}

export default {
  state,
  mutations,
  actions,
  getters
}
