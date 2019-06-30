import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import User from "./views/User.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/",
      redirect: Home
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      children: [
        {
          path: "/user",
          component: User
        }
      ]
    }
  ]
});
