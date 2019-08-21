// import * as types from './mutation-types'
const common = {
    state: {
        updatedloading: '',
    },
    //同步更新状态
    mutations: {
        UPDATE_LOADING: (state, type) => {
            state.updatedloading = type
        }
    },
    //异步更新状态
    actions: {
        loadingAction({ commit }, updatedloading) {
            commit('UPDATE_LOADING', updatedloading)
        }
    }
}
export default common