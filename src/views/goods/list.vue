<template>
  <div class="list">
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/goods/list' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--搜索框-->
    <el-input placeholder="请输入内容" v-model="goodsobj.query" class="input-with-select" style="width:300px" @keydown.enter.native="init">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success" plain style="margin-left:5px" @click="$router.push({name:'add'})">添加商品</el-button>
    <!--表格-->
    <el-table :data="goodsList" border   >
      <el-table-column type="index" width="50" label="编号"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="380"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="100"></el-table-column>
      <el-table-column prop="goods_state"  label="商品状态" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{scope.row.add_time|timeFormate}}
          </template>
      </el-table-column>
       <!--操作 -->
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content=" 审核" placement="top">
            <el-button type="success" icon="el-icon-check" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除" placement="top">
            <el-button type="danger " icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsobj.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="goodsobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
    </el-pagination>
  </div>
</template>
<script>
import { getAllGoodsList } from '@/api/goods_index.js'
import { timeFormate } from '@/utils/myfilter.js'
export default {
  data () {
    return {
      total: 0,
      goodsList: [],
      goodsobj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  filters: {
    timeFormate
  },
  methods: {
    async init () {
      let res = await getAllGoodsList(this.goodsobj)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.goodsList = res.data.data.goods
        this.total = res.data.data.total
      } else if (res.data.meta.status === 401) {
        this.$message.warning(res.data.meta.msg)
      }
    },
    //   当切换sizes下拉列表时触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.goodsobj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.goodsobj.pagenum = val
      this.init()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
</style>
