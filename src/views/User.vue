<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="6">
        <div>
          <el-input placeholder="请输入内容" v-model="keywords" @keyup.enter.native="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="openAddUserDialogShow">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>

      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleStatus(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            @click="openEditUserDialog(row.id)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delUser(row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="onPageChange"
    ></el-pagination>

    <!-- 添加用户模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="isAddUserDialogShow"
      @close="$refs.addUserForm.resetFields()"
    >
      <el-form ref="addUserForm" label-width="100px" :model="addUserFormData" :rules="addUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input autocomplete="off" v-model="addUserFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input autocomplete="off" v-model="addUserFormData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="addUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input autocomplete="off" v-model="addUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息模态框 -->
    <el-dialog title="修改用户信息" :visible.sync="isEditUserDialogShow">
      <el-form
        ref="editUserForm"
        label-width="100px"
        :model="editUserFormData"
        :rules="editUserRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editUserFormData.username"></el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="editUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input autocomplete="off" v-model="editUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isEditUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>




<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      total: 0,
      keywords: "",
      currentPage: 1,
      pageSize: 3,
      isAddUserDialogShow: false,
      isEditUserDialogShow: false,
      // 添加用户的表单数据
      addUserFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 表单校验规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名长度为5-12个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度为6-15个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      editUserFormData: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      // 表单校验规则
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      axios({
        url: "http://localhost:8888/api/private/v1/users",
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize,
          query: this.keywords
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(({ data: { data, meta } }) => {
        if (meta.status === 200) {
          this.userList = data.users;
          // console.log(data);
          this.total = data.total;
        }
      });
    },
    search() {
      // console.log(this.value);
      this.getUserList();
    },
    onPageChange(page) {
      console.log(page);
      this.currentPage = page;
      this.getUserList();
    },
    async toggleStatus(user) {
      // 改变状态，在这里应该发送ajax请求给后台，
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });
        // 后台请求出错后，switch状态不会改变
        user.mg_state = !user.mg_state;
      }
    },
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除此用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          method: "delete",
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.currentPage = 1;
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    openAddUserDialogShow() {
      // 显示添加用户模态框
      this.isAddUserDialogShow = true;
    },
    async addUser() {
      try {
        // 先进行表单校验
        // console.log(this.$refs.addUserForm);
        await this.$refs.addUserForm.validate();
        console.log("表单校验成功");
        // 校验成功,发送ajax请求
        let res = await axios({
          url: "http://localhost:8888/api/private/v1/users",
          method: "post",
          data: this.addUserFormData,
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        // console.log(res);
        if (res.data.meta.status === 201) {
          this.$message({
            type: "success",
            duration: 1000,
            message: res.data.meta.msg
          });
          // 重新渲染页面
          this.getUserList();
          // 关闭添加用户模态框
          this.isAddUserDialogShow = false;
        } else {
          this.$message({
            type: "error",
            duration: 1000,
            message: res.data.meta.msg
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async openEditUserDialog(id) {
      console.log(id);
      // 显示模态框
      this.isEditUserDialogShow = true;
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        this.editUserFormData = res.data.data;
      }
    },
    async editUser() {
      // 点击确定，编辑用户提交
      // 先进行表单校验，校验成功发送ajax请求
      try {
        await this.$refs.editUserForm.validate();
        // 校验成功 发送ajax请求
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${this.editUserFormData.id}`,
          method: "put",
          headers: {
            Authorization: localStorage.getItem("token")
          },
          data: {
            mobile: this.editUserFormData.mobile,
            email: this.editUserFormData.email
          }
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          // 提示用户更新成功
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          // 重新渲染，关闭模态框
          this.getUserList();
          this.isEditUserDialogShow = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang= 'less'scoped>
.el-breadcrumb.breadcrumb {
  font-size: 16px;
  background-color: #d4dae0;
  padding-left: 10px;
  height: 50px;
  line-height: 50px;
}
</style>

