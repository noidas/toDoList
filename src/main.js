import Vue from "vue";
import App from "./App.vue";

import router from "./config/router";
import "font-awesome/css/font-awesome.css";
import "./config/bootstrap";
import "./config/msgs";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
