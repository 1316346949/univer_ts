import { createStore } from "vuex";

export default createStore({
  state: {
    // 定义应用的状态
    range: [],
  },
  mutations: {
    setRange(state, range) {
      state.range = range;
    },
  },
  actions: {
    // 定义异步方法，通常在这里发起 API 请求
    setRangeFn({ commit }, range) {
      // 模拟一个 API 请求
      commit("setRange", range);
    },
  },
  getters: {
    // 定义计算属性
    getRange(state) {
      return state.range;
    },
   
  },
});
