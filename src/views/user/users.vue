<template>
  <div class="users">
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 10px;">
      <el-input
        placeholder="请输入内容"
        v-model="userobj.query"
        @input.native="init"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" @click="addDialogFormVisible=true">添加用户</el-button>
    </div>
    <el-table border style="width: 100%;margin-top:15px" :data="userList">
      <el-table-column type="index" v-model="userobj"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!--状态设置-->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <!--用户操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="编辑用户" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content=" 分配角色" placement="top">
            <el-button type="success" icon="el-icon-check" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除用户" placement="top">
            <el-button type="danger " icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userobj.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="userobj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!--添加用户弹框-->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" required placeholder="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" required>
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑用户弹框-->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true" style="width:80px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" required>
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" required>
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

    <!--分配角色弹框-->
    <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form
        :model="grantForm"
        :rules="rules"
        ref="grantForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名:">
          <span :disabled="true" style="width:80px">{{grantForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色:" required>
          <!-- <el-input v-model="editForm.mobile"></el-input> -->
          <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// 调入接口
import {
  getAllUsers,
  addUser,
  editUser,
  grantUser,
  delUserById,
  updateUser
} from '@/api/user_index.js'
import { getAllRoles } from '@/api/role_index.js'
export default {
  data () {
    return {
      total: 0,
      status: true,
      userList: [],
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 添加
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑
      editDialogFormVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      // 分配角色
      grantDialogFormVisible: false,
      grantForm: {
        username: '',
        id: '',
        rid: ''
      },
      roleList: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的电话号码',
            trigger: 'blur'
          }
        ]
      }
      // resetForm (formName) {
      //   this.$refs[formName].resetFields()
      // }
    }
  },
  methods: {
    // 添加用户
    add () {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success('用户新增成功')
                this.init()
                this.addDialogFormVisible = false
                this.$refs.addForm.resetFields()
              }
            })
            .catch(err => {
              // console.log(err)
              if (err) {
                this.$message.error('用户新增失败')
              }
            })
        } else {
          this.$message.warning('请输入所有必填数据')
        }
      })
    },

    // 编辑用户
    edit () {
      editUser(this.editForm)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success('用户编辑成功')
            this.init()
            this.editDialogFormVisible = false
          }
        })
        .catch(() => {
          // console.log(err)
          this.$message.error('用户编辑失败')
        })
    },
    showEditDialog (row) {
      this.editDialogFormVisible = true
      // console.log(row)
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },

    // 分配角色
    showGrantDialog (row) {
      console.log(row)
      this.grantDialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      this.grantForm.rid = row.rid
    },
    grantUser () {
      // console.log(this.grantForm)
      if (this.grantForm.rid) {
        grantUser(this.grantForm)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.grantDialogFormVisible = false
              this.init()
            }
          })
          .catch(() => {
            this.$message.error('设置角色失败')
          })
      } else {
        this.$message.warning('请选择角色')
      }
    },
    // 删除用户
    delUser (id) {
      console.log(this.userobj)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id)
            .then(res => {
              // console.log(res)
              // console.log(this.userobj.pagenum)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.init()
                // console.log(this.userobj.pagenum)
                // console.log(this.total)
                // console.log(this.userobj.pagesize)
                // if (Math.ceil((this.total - 1) / this.userobj.pagesize) < this.userobj.pagenum) {
                //   this.userobj.pagenum--
                // } else {
                //   // console.log(123)
                //   this.userobj.pagenum = this.userobj.pagenum
                // }
                console.log(this.userList.length)
                if (this.userList.length === 1) {
                  this.userobj.pagenum--
                }
              }
            })
            .catch(() => {
              this.$message.error('删除失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 状态修改
    changeState (uid, type) {
      console.log(uid)
      console.log(type)
      updateUser(uid, type)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '状态修改成功!'
            })
            this.init()
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
        .catch(() => {
          this.$message.error('状态修改失败')
        })
    },

    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    },
    init () {
      // console.log(this.userobj)
      getAllUsers(this.userobj)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
            // console.log(res.data.data.total)
            // console.log(res.data.data.users.length)
            // console.log(this.userobj.pagenum)
            // console.log(res.data.data.pagenum)
            // if (res.data.data.users.length === 1) {
            //   this.userobj.pagenum = res.data.data.pagenum
            //   this.userobj.pagenum--
            // }
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            this.$router.push({ name: 'login' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
    getAllRoles()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
  }
}
</script>
<style lang="less" scoped>
.el-input {
  width: 580px;
  margin-right: 5px;
}
</style>
