import Vue from "vue";
import VueRouter from "vue-router";

import ToDoList from "../components/ToDoList";
import ToDoListApi from "../components/ToDoListApi";

Vue.use(VueRouter);

const routes = [
  {
    name: "ToDoList",
    path: "/",
    component: ToDoList,
  },
  {
    name: "ToDoListApi",
    path: "/api",
    component: ToDoListApi,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
