
import * as types from '../types.js';
import {_fetchMdCart, _fetchCartList} from '../api';

const state = {
  _cartUuid: '',
  _mdCartList: [],
  _cartServe: [],
  _cartCode: '',
  _commonData: {},
  _serveName: '',
  _serveType: ''
};

const actions = {
  fetchMdCart({commit}, data){
    _fetchMdCart(data)
    .then(res => commit(types.SET_CART_DATA, res));
  },

  setCommonData({commit}, data){
    commit(types.COMMON_DATA_MD, data);
  },
};
const getters = {
  cartCode (state) {
    return state._cartCode
  },
  cartServe (state) {
    return state._cartServe
  },
  commonData (state) {
    return state._commonData
  },
  serveName (state) {
    return state._serveName
  },
  serveType (state) {
    return state._serveType
  },
}
const mutations = {

  [types.SET_CART_DATA](state, res){
    if (res.code === '1') {
      state._cartServe = res.data
      state._cartCode = res.code
    } else {
      state._cartServe = res.msg
    }
  },
  setCartData(state, res){
    if (res.code === '1') {
      state._cartServe = res.data
      state._cartCode = res.code
    } else {
      state._cartServe = res.msg
    }
  },
  [types.COMMON_DATA_MD](state, data){
    state._commonData = data.serveUuid
    state._serveName = data.serveName
    state._serveType = data.serveType
  },

};


export default {
  state,
  mutations,
  actions,
  getters
}
