import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import 'babel-polyfill'
import user from './modules/user'
import common from './modules/common'
import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
const store = new Vuex.Store({
    modules: {
        user,
        common,
        plugins: debug ? [createLogger(),createPersistedState()] : [createPersistedState()]
    },
    getters,
})
export default store