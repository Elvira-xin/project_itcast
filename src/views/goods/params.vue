<template>
  <div class="params">
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/params' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--级联选择器-->
    <el-cascader
      expand-trigger="hover"
      :options="cateList"
      change-on-select
      :props="cascaderProps"
      v-model="selectedOptions"
      :show-all-levels="false"
    ></el-cascader>
    <!--标签页-->
    <el-tabs type="border-card" style="margin-top:15px" @tab-click="handleParams">
      <el-tab-pane label="动态参数" >
        <el-button type="success" plain size="small">添加参数名称</el-button>
        <!--表格-->
        <el-table
          :data="attrVals"
          highlight-current-row
          border
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template  >
              <el-tag
               v-for="item in attrVals"
          :key="item.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+添加值</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="商品参数" width="180"></el-table-column>
          <el-table-column label="操作" width="180"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性">
        <el-button type="success" plain size="small">添加静态属性</el-button>
        <el-table :data="paramsList" border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="180"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getAllCateList } from '@/api/cate_index.js'
import { getCateParams } from '@/api/cate_params.js'
export default {
  data () {
    return {
      attr_vals: '',
      // 动态参数数组
      attrVals: [],
      // 级联选择器中的数据
      cateList: [],
      // 静态参数
      paramsList: [],
      paramsForm: {
        attr_name: '',
        attr_id: '',
        cat_id: '',
        pics: [],
        attrs: []
      },
      cascaderProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      selectedOptions: [1, 3, 6]
      // selectedOptions: ''
    }
  },
  methods: {
    handleParams () {
      this.init()
    },
    init () {
      getCateParams(this.selectedOptions[2], 'many').then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.attrVals = res.data.data
          for (var i = 0; i < this.attrVals.length; i++) {
            this.attrVals[i].attr_vals = this.attrVals[i].attr_vals.split(',')
          }
        }
      })
      getCateParams(this.selectedOptions[2], 'only').then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.paramsList = res.data.data
        }
      })
    }

  },
  mounted () {
    getAllCateList().then(res => {
      console.log(res)
      this.cateList = res.data.data
    })

    this.init()
  }
}
</script>

<style lang="less" scoped>
</style>
