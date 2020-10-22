import { Login, Logout } from "@/request/login";
import { getStore, setStore } from "@/common/util.js";
const user = {
  namespaced: true,
  state: {
    token: getStore("token"),
    username: "",
    userId: "",
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },

    SET_USETNAME: (state, username) => {
      state.username = username;
    },
    SET_USERID: (state, redirect) => {
      state.userId = redirect;
    },
  },
  actions: {
    loginUserdo({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        Login(userInfo)
          .then((response) => {
            commit("SET_TOKEN", response.userToken);
            setStore("userToken", response.userToken);
            setStore("user", {
              account: userInfo.account,
              password: userInfo.password,
            });
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    loginout({ commit }, type) {
      return new Promise((resolve, reject) => {
        Logout().then((response) => {
          if (response) {
            commit("SET_TOKEN", "");
            setStore("userToken", "");
            setStore("user", {
              account: getStore("user").account,
              password: "",
            });
            resolve(response);
          } else {
            reject(response);
          }
        });
      });
    },
  },
};
export default user;
