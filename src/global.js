import Vue from "vue";

export const keyStorage = "__todolist";
export const baseApiUrl = "https://seu.endereco.api";
// export const baseApiUrl = "http://192.168.28.51:3001";

export function showError(e) {
  if (e && e.response && e.response.data) {
    Vue.toasted.global.defaultError({ msg: e.response.data });
  } else if (typeof e === "string") {
    Vue.toasted.global.defaultError({ msg: e });
  } else {
    Vue.toasted.global.defaultError();
  }
}
