<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain>添加商品</el-button>

    <!-- 表格 -->
    <el-table ref="singleTable" :data="goodsList" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentPage"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      pagesize: 6,
      currentPage: 1,
      total: 0
    };
  },
  methods: {
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.currentPage,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    },
    onPageChange(value) {
      // console.log(value);
      this.currentPage = value;
      this.getGoodsList();
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

<style scoped>
.breadcrumb {
  margin-bottom: 10px;
}

.el-pagination {
  padding: 20px 5px;
}
</style>



