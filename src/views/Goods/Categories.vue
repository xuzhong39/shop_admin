<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="openAddCategoryDialog">添加分类</el-button>

    <!-- 表格 -->
    <el-table :data="categoryList" stripe style="width: 100%">
      <el-table-tree-column
        level-key="cat_level"
        file-icon="el-icon-notebook-1"
        foldler-icon="el-icon-folder"
        prop="cat_name"
        tree-key="cat_id"
        parent-key="cat_pid"
      ></el-table-tree-column>
      <el-table-column label="是否有效">
        <template v-slot="{row}">{{row.cat_deleted ? '否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column label="操作"></el-table-column>
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

    <!-- 添加分类模态框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isAddCategoryDialogShow"
      @close="$refs.cateFormData.resetFields()"
    >
      <el-form ref="cateFormData" label-width="100px" :model="addCateFormData">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateFormData.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="parentArr">
          <el-cascader
            :options="cateOptions"
            :props="defaultProps"
            v-model="addCateFormData.parentArr"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddCategoryDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElTreeGrid from "element-tree-grid";
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoryList: [],
      addCateFormData: {
        cat_name: "",
        parentArr: []
      },
      pagesize: 5,
      total: 0,
      currentPage: 1,
      isAddCategoryDialogShow: false,
      cateOptions: [],
      defaultProps: {
        label: "cat_name",
        value: "cat_id",
        checkStrictly: true
      }
    };
  },
  created() {
    this.getcategoryList();
  },
  methods: {
    async getcategoryList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagesize: this.pagesize,
          pagenum: this.currentPage
        }
      });
      console.log(res);
      this.categoryList = res.data.data.result;
      this.total = res.data.data.total;
    },
    onPageChange(currentPage) {
      this.currentPage = currentPage;
      this.getcategoryList();
    },
    async openAddCategoryDialog() {
      //请求父级分类数据
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      // console.log(res);
      this.cateOptions = res.data.data;
      // 显示添加分类模态框
      this.isAddCategoryDialogShow = true;
    },
    async addCate() {
      // 获取表单数据
      let cat_name = this.addCateFormData.cat_name;
      // 获取层级，层级就是数组的长度
      let cat_level = this.addCateFormData.parentArr.length;
      // 获取父级id,我们只需要最后一个
      let cat_pid = this.addCateFormData.parentArr.pop() || 0;

      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_name,
          cat_pid,
          cat_level
        }
      });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        // 关闭模态框
        this.isAddCategoryDialogShow = false;
        // // 清空表单
        // // console.log(this.$refs.cateFormData.resetFields);
        // // this.$refs.cateFormData.resetFields();
        // this.addCateFormData = {};
        // 刷新列表
        this.getcategoryList();
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

.el-pagination {
  padding: 20px 5px;
}
</style>
