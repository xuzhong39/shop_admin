import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 1.引入ElementUI库
import ElementUI from "element-ui";
// 2.引入css文件
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/index.css";

// 引入图片文件
import "./assets/img/logo.png";

// 3.安装ElementUI
Vue.use(ElementUI);

// 注册一个导航守卫
router.beforeEach((to, from, next) => {
  // 1.判断用户访问的是不是登录页面，如果是，放行，
  if (to.path === "/login") {
    next();
  }

  // 2.如果用户访问的是其他页面，判断用户是否进行了登录
  //   2.1 如果登录了，那就直接放行
  //   2.2 如果没登录，就返回登录页
  if (localStorage.getItem("token")) {
    next();
  } else {
    router.push("/login");
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
