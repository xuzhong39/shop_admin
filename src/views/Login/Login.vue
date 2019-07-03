<template>
  <!-- el-row相当于一个div  这个组件是用来布局的-->
  <!-- type是布局模式，可以是flex -->
  <!-- justify用来设置主轴的对齐方式  align设置侧轴的对齐方式 -->
  <el-row type="flex" justify="center" align="middle">
    <!-- el-col 布局组件 列组件 -->
    <!-- span属性使用来设置当前所占格数的 -->
    <el-col :xl="6" :lg="8" :md="10" :sm="12" :xs="14">
      <div class="grid-content bg-purple"></div>
      <el-form
        ref="loginForm"
        :rules="ruleForm"
        :model="form"
        label-width="80px"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!-- </el-row> -->
  </el-row>
</template>





<script>
// 要实现表单校验
// 1.先给数据中添加一个校验规则的对象
// 2.rules:{表单绑定的数据的名称:[{required:true,message:'提示信息',trigger:'触发校验的时机 blur  change'}]
// 3.需要把这个校验规则对象绑定到el-form组件上， :rules = 'ruleForm'
// 4.需要给每一项需要校验的el-form-item组件 添加一个属性prop 属性值就是表单绑定的数据的名称

export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
      },
      ruleForm: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名字符长度为5到12个",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在6-12个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       // alert("submit!");
    //       // console.log(this.$refs[loginForm].validate);
    //       // 发送ajax请求
    //       axios({
    //         url: "http://localhost:8888/api/private/v1/login",
    //         method: "post",
    //         data: this.form
    //       }).then(({ data: { data, meta } }) => {
    //         // console.log(res);
    //         console.log(data, meta);
    //         if (meta.status === 200) {
    //           // 登录成功之后，服务器返回一个token
    //           // 将token保存到本地 保存到localStorage中即可
    //           localStorage.setItem("token", data.token);
    //           this.$router.push("/home");
    //         }
    //       });
    //     } else {
    //       // console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // }
    async submitForm(formName) {
      let valid = await this.$refs[formName].validate();
      if (valid) {
        // alert("submit!");
        // console.log(this.$refs[loginForm].validate);
        // 发送ajax请求
        let {
          data: { data, meta }
        } = await this.$http({
          url: "login",
          method: "post",
          data: this.form
        });
        // console.log(res);
        // console.log(data, meta);
        if (meta.status === 200) {
          // 登录成功之后，服务器返回一个token
          // 将token保存到本地 保存到localStorage中即可
          localStorage.setItem("token", data.token);
          this.$router.push("/home");
        }
      } else {
        // console.log("error submit!!");
        return false;
      }
    }
  },
  resetForm(formName) {
    this.$refs[formName].resetFields();
  }
};
</script>

<style scoped>
.el-row.is-justify-center.is-align-middle.el-row--flex {
  height: 100%;
  background-color: rgb(45, 67, 76);
}
.el-col {
  border-radius: 10px;
  background-color: #fff;
  padding: 30px 20px;
  min-width: 400px;
}
</style>



// git pull origin master --allow-unrelated-histories //把远程仓库和本地同步，消除差异