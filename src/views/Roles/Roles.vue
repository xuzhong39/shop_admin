<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table ref="roleTable" :data="roleList" stripe style="100%">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row type="flex" class="level1" v-for="level1 in row.children" :key="level1.id">
            <el-col :span="6">
              <el-tag closable @close="deleteRight(row,level1.id)">{{level1.authName}}</el-tag>
            </el-col>
            <el-col>
              <el-row type="flex" class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRight(row,level2.id)"
                  >{{level2.authName}}</el-tag>
                </el-col>
                <el-col>
                  <el-tag
                    class="level3"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    @close="deleteRight(row,level3.id)"
                    type="warning"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column prop label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="openAssainRightsDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限模态框 -->
    <el-dialog title="角色授权" :visible.sync="isAssainRightDialogShow">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkedRights"
        :props="defaultProps"
        ref="rightsTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAssainRightDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateRoleRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      roleList: [],
      isAssainRightDialogShow: false,
      rightsList: [],
      defaultProps: {
        // 设置子级元素的属性名
        children: "children",
        // 当前节点展示的文字的属性名
        label: "authName"
      },
      currentEditRoleId: -1,
      checkedRights: []
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList(callback) {
      let res = await this.$http({
        url: "roles"
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.roleList = res.data.data;
      }
      callback && callback();
    },
    async deleteRight(row, id) {
      // console.log(row, id);

      // 调用接口，删除单个权限
      // 接口信息 roles/:id/rights/:rightID
      let res = await this.$http({
        url: `roles/${row.id}/rights/${id}`,
        method: "delete"
      });
      console.log(res);
      // console.log(row.children);
      // let level1Ids = [];
      // let level2Ids = [];
      // let level3Ids = [];
      // row.children.forEach(level1 => {
      //   level1Ids.push(level1.id);
      //   level1.children.forEach(level2 => {
      //     level2Ids.push(level2.id);
      //     level2.children.forEach(level3 => {
      //       level3Ids.push(level3.id);
      //     });
      //   });
      // });
      // console.log(level1Ids, level2Ids, level3Ids);
      //   let result = [...level1Ids, ...level2Ids, ...level3Ids];
      //   // console.log(result);
      //   let ids = result.filter(v => v !== id).join(",");
      //   let res = await this.$http({
      //     url: `roles/${row.id}/rights`,
      //     method: "post",
      //     data: {
      //       rids: ids
      //     }
      //   });
      //   // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        console.log(this.roleList);
        this.getRoleList(() => {
          this.$nextTick(() => {
            this.$refs.roleTable.toggleRowExpansion(
              this.roleList.find(v => v.id === row.id),
              true
            );
          });
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });
      }
    },
    async openAssainRightsDialog(row) {
      // console.log(row);
      //把当前正在编辑的id改成role的id
      this.currentEditRoleId = row.id;
      // 打开模态框
      this.isAssainRightDialogShow = true;
      // 获取所有的权限信息
      let res = await this.$http({
        url: "rights/tree"
      });
      // console.log(res);
      // 将权限列表绑定给tree组件
      this.rightsList = res.data.data;
      // 需要让当前tree组件默认选中当前角色拥有的权限信息
      // checkedRights ： 我们需要把当前角色row中所有的权限的id，组合成一个数组，赋值给checkedRights
      // let level1Ids = [];
      // let level2Ids = [];
      let level3Ids = [];
      row.children.forEach(level1 => {
        // level1Ids.push(level1.id);
        level1.children.forEach(level2 => {
          // level2Ids.push(level2.id);
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      // console.log(level1Ids, level2Ids, level3Ids);
      let arr = [...level3Ids];
      // 将arr 赋值给checkedRights
      this.checkedRights = arr;
    },
    async updateRoleRights() {
      // 获取tree组件中所有被勾选或者半勾选的节点的id
      let ids = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ];
      // console.log(ids);
      let result = ids.join(",");
      let res = await this.$http({
        url: `roles/${this.currentEditRoleId}/rights`,
        method: "post",
        data: {
          rids: result
        }
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        // 关闭模态框
        this.isAssainRightDialogShow = false;
        // 重新渲染
        this.getRoleList();
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
.level1 {
  padding: 10px 0;
  border-bottom: 1px dashed #ccc;
}
.level1:last-child {
  border-bottom: none;
}
.level2 {
  margin-bottom: 15px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>