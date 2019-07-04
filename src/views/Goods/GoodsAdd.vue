<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 步骤条 -->
    <el-steps :active="activeNow" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>

    <!-- tabs标签页，tab栏 -->
    <el-tabs tab-position="left" @tab-click="changeTab" :value="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <el-form label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsFormData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <div class="block">
              <span class="demonstration"></span>
              <el-cascader
                :options="cateOptions"
                :props="defaultProps"
                v-model="addGoodsFormData.goods_catArr"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio label="1" name="promote" v-model="addGoodsFormData.is_promote">是</el-radio>
            <el-radio label="0" name="promote" v-model="addGoodsFormData.is_promote">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1,'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload action="http://localhost:8888/api/private/v1/upload" list-type="picture-card">
          <el-button size="small" type="primary">点击上传</el-button>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>

        <el-button type="primary" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addGoodsFormData.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      activeNow: 0,
      activeName: "basic",
      addGoodsFormData: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_catArr: [],
        goods_introduce: "",
        is_promote: 1,
        pics: []
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    // console.log(res);
    this.cateOptions = res.data.data;
  },
  methods: {
    next(index, activeTabs) {
      this.activeNow = +index;
      this.activeName = activeTabs;
    },
    changeTab(tab) {
      this.activeNow = +tab.index;
    },
    async addGoods() {
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: {
          goods_name: this.addGoodsFormData.goods_name,
          goods_price: this.addGoodsFormData.goods_price,
          goods_weight: this.addGoodsFormData.goods_weight,
          goods_number: this.addGoodsFormData.goods_number,
          goods_cat: this.addGoodsFormData.goods_catArr.join(","),
          goods_introduce: this.addGoodsFormData.goods_introduce,
          is_promote: this.addGoodsFormData.is_promote,
          pics: this.addGoodsFormData.pics
        }
      });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$router.push("/goods");
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });
      }
    }
  }
};
</script>


<style scoped>
.breadcrumb {
  margin-bottom: 10px;
}
</style>
