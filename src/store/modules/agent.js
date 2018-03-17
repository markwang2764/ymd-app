
import * as types from '../types.js';
import {_fetchAgentType} from '../api';

const state = {
  AgentType: {
    identity_verify: '',
    company_verify: '',
    user_identity_info: {},
    company_identity_info: {}
  }
};

const actions = {
  fetchAgentType({commit}, data){
    _fetchAgentType(data)
    .then(res => commit(types.SET_DATA, res));
  }
};
const getters = {
  user_info (state) {
    return state.AgentType.user_identity_info
  },
  company_info (state) {
    return state.AgentType.company_identity_info
  },
  userType (state) {
    return state.AgentType.agent_verify
  },
  companyType (state) {
    return state.AgentType.company_verify
  }
}
const mutations = {

  [types.SET_DATA](state, data){
    state.AgentType = data;
  },

};


export default {
  state,
  mutations,
  actions,
  getters
}
