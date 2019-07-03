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
    async getUserList() {
      let res = await this.$http({
        url: "users",
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize,
          query: this.keywords
        }
      });
      let {
        data: { data, meta }
      } = res;
      if (meta.status === 200) {
        this.userList = data.users;
        // console.log(data);
        this.total = data.total;
      }
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
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: "put"
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
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete"
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
        let res = await this.$http({
          url: "users",
          method: "post",
          data: this.addUserFormData
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
      let res = await this.$http({
        url: `users/${id}`
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
        let res = await this.$http({
          url: `users/${this.editUserFormData.id}`,
          method: "put",

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
