import { createStore } from 'vuex'

const store = createStore({
  state: {
    profile: null,
    productsCount: 0
  },
  mutations: {
    setProfile(state, payload) {
      state.profile = payload;
    },
    setProductsCount(state, payload) {
      state.productsCount = payload;
    }
  }
});

export default store;
