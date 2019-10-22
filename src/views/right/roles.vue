<template>
  <div class="right">
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--添加角色按钮-->
    <el-button type="success" @click="addDialogFormVisible=true">添加角色</el-button>
    <!--角色表格-->
    <el-table :data="rolesList" border style="width: 100%;margin-top:10px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="delRoles(scope.row,first.id);count=0"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="count=0;delRoles(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'warning'"
                    @close="count=0;delRoles(scope.row,third.id)"
                    style="margin-bottom:10px;margin-right:10px"
                    v-for="third in second.children"
                    :key="third.id"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <span>没有任何的权限，请先分配！</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="380">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="编辑用户" placement="top">
            <el-button type="info" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content=" 分配角色" placement="top">
            <el-button type="success" icon="el-icon-check" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除用户" placement="top">
            <el-button type="danger " icon="el-icon-delete" @click="delBtn(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--树状组件-->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
        :default-expand-all="true"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--添加角色框-->
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName" required>
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" required>
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary" @click="addBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllRoles,
  delRolesById,
  grantRoleById,
  addRoles,
  delRoles
} from '@/api/role_index.js'
import { getAllRight } from '@/api/right_index.js'
export default {
  data () {
    return {
      addDialogFormVisible: false,
      roleId: '',
      count: '0',
      rolesList: [],
      chkedArr: [],
      rightList: [],
      grantdialogFormVisible: false,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 添加
      addForm: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  mounted () {
    this.init()
    getAllRight('tree').then(res => {
      console.log(res)
      this.rightList = res.data.data
    })
  },
  methods: {
    init () {
      getAllRoles('tree').then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data
        }
      })
    },
    // 删除权限
    delRoles (row, rightId) {
      //   console.log(123)
      //   console.log(row.id)
      //   console.log(rightId)
      delRolesById(row.id, rightId)
        .then(res => {
          //   console.log(res)
          row.children = res.data.data
          row.children.forEach((v1, in1) => {
            if (v1.children.length === 0) {
              this.delRoles(row, v1.id)
            } else {
              v1.children.forEach((v2, in2) => {
                if (v2.children.length === 0) {
                  this.delRoles(row, v2.id)
                }
              })
            }
          })
          if (this.count === 0) {
            this.$message.success(res.data.meta.msg)
            this.count++
          }
        })
        .catch(() => {
          this.$message.error('取消权限失败')
        })
    },
    // 展示树形数据
    showGrantDialog (row) {
      // console.log(row)
      this.roleId = row.id
      this.grantdialogFormVisible = true
      // 加载树形组件数据
      // getAllRight('tree').then(res => {
      // // console.log(res)
      //   this.rightList = res.data.data
      // })
      // 深拷贝
      this.rightList = [...this.rightList]
      this.chkedArr.length = 0
      row.children.forEach(first => {
        if (first.children.length > 0) {
          first.children.forEach(second => {
            if (second.children.length > 0) {
              second.children.forEach(third => {
                this.chkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    // 更新权限
    async grantRole () {
      // console.log(this.$refs.tree.getCheckedKeys())
      // console.log(this.$refs.tree.getCheckedNodes())
      // 使用getCheckedNodes得到的id进行拼接获取所有子节点和父节点id
      let arr = this.$refs.tree.getCheckedNodes()
      console.log(arr)
      // 创建一个新数组来装所有子节点和父节点
      let temp = []
      // 遍历数组
      for (var i = 0; i < arr.length; i++) {
        temp.push(arr[i].id + ',' + arr[i].pid)
      }
      // console.log(temp)
      // 把数据转换为数组的形式=> ["122", "121", "101", "123", "121", "101"]
      temp = temp.join(',').split(',')
      console.log(temp)
      // 使用new Set的方法去重 得到的是一个对象 => {"142", "115", "101", "143"}
      // 使用展开运算符把对象里的数据转换成数组
      temp = [...new Set(temp)]
      temp = temp.join(',')
      console.log(temp)
      // 异步请求角色授权数据
      let res = await grantRoleById(this.roleId, temp)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.grantdialogFormVisible = false
        this.init()
      } else {
        this.$message.error(res.data.meta.msg)
      }
    },
    // 添加角色
    addBtn () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addRoles(this.addForm).then(res => {
            console.log(res)
            if (res.data.meta.status === 201) {
              this.$message.success('添加成功')
              this.addDialogFormVisible = false
              this.$refs.addForm.resetFields()
              this.init()
            }
          })
        }
      })
      // addRoles()
      //   .then(res => {
      //     console.log(res)
      //   })
    },
    // 删除角色
    delBtn (id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRoles(id)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.init()
            }
          })
          .catch(() => {
            this.$message.error('删除失败')
          })
      })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
