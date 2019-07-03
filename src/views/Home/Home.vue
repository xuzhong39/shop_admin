<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <img src="../../assets/img/logo.png" alt />
        </el-col>
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div>
            前端与移动开发39期
            <a href="javascript:;" @click="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu v-for="menus1 in menusList" :key="menus1.id" :index="''+menus1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menus1.authName}}</span>
            </template>

            <el-menu-item
              v-for="menus2 in menus1.children"
              :key="menus2.id"
              :index="'/' + menus2.path"
            >
              <i class="el-icon-menu"></i>
              <span>{{menus2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  data() {
    return {
      menusList: []
    };
  },
  async created() {
    let res = await this.$http({
      url: "menus"
    });
    console.log(res);
    if (res.data.meta.status === 200) {
      this.menusList = res.data.data;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>


<style lang="less">
.el-container {
  .el-header {
    background-color: #b3c1cd;
    padding: 0;
    margin: 0;
    .el-row {
      .el-col {
        padding: 0;
        height: 100%;

        h1 {
          margin: 0;
          font-weight: 700;
          text-align: center;
        }
        div {
          text-align: right;
          padding: 20px;
          a {
            color: orange;
          }
        }
        img {
          width: 200px;
        }
      }
    }
  }
  .el-main {
    overflow: overlay;
  }
}
.el-container {
  height: 100%;
}
.el-aside {
  height: 100%;
  .el-menu-vertical-demo.el-menu {
    height: 100%;
  }
}
</style>




