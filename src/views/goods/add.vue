<template>
  <div class="add">
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <div class="text item">
        <p>添加商品信息</p>
        <br />
        <el-steps :active="activeName-0" finish-status="success">
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
          <el-step title="步骤 4"></el-step>
          <el-step title="步骤 5"></el-step>
        </el-steps>
        <template>
          <!--标签页-->
          <el-tabs
            :tab-position="tabPosition='left'"
            v-model="activeName"
            :before-leave="beforeLeave"
            @tab-click="handleClick"
          >
            <el-tab-pane label="基本信息" name="0">
              <el-form ref="form" label-width="80px">
                <el-form-item label="商品名称">
                  <el-input v-model="goodsForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                  <el-input v-model="goodsForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                  <el-input v-model="goodsForm.goods_state"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                  <el-input v-model="goodsForm.goods_number"></el-input>
                </el-form-item>
                <!--级联选择器-->
               <el-form-item label="商品分类">
              <el-cascader expand-trigger="hover" :options="cateList" change-on-select :props="cascaderProps" v-model="goodsForm.goods_cat"></el-cascader>
              </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="商品参数" name="1">
              <el-checkbox-group size="small" v-model="item.attr_vals" v-for="item in attrValue" :key="item.attr_id">
                <el-checkbox  border  :label="subitem" v-for="(subitem,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2"></el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!--图片上传-->
              <el-upload
                class="upload-demo"
                action="http://localhost:8888/api/private/v1/upload"
                :headers="setToken()"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :file-list="fileList"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!--上传图片-->
              <quillEditor></quillEditor>
            </el-tab-pane>
          </el-tabs>
        </template>
        <!-- 按钮 -->
        <el-button type="primary">确定</el-button>
        <el-button type="primary">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { getAllCateList } from '@/api/cate_index.js'
import { getCateParams } from '@/api/cate_params.js'
export default {
  data () {
    return {
      attrValue: [], // 动态参数数组
      fileList: [],
      cascaderProps: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      activeName: '0',
      cateList: [],
      active: 1,
      goodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      }
    }
  },
  components: {
    quillEditor
  },
  methods: {
    // 标签跳转之前
    beforeLeave (activeName, oldActiveName) {
      if (activeName === '1' || activeName === '2') {
        if (this.goodsForm.goods_cat.length !== 3) {
          this.activeName = '0'
          this.$message.warning('请选择分类')
          return false
        }
      }
    },
    // 处理标签页单击，获取参数数据
    async handleClick () {
      if (this.activeName === '1') {
        let res = await getCateParams(this.goodsForm.goods_cat[2], 'many')
        console.log(res)
        this.attrValue = res.data.data
        for (var i = 0; i < this.attrValue.length; i++) {
          this.attrValue[i].attr_vals = this.attrValue[i].attr_vals.split(',')
        }
      }
    },
    // 文件上传前的钩子
    beforeUpload (file) {
      console.log(file)
      // 判断上传的文件是否满足条件
      if (file.type.indexOf('image/') !== 0) {
        this.$message.warning('请选择满足格式要求的文件，如jpg,png,jpeg')
        return false
      }
    },
    // 文件上传的header里面设置token
    setToken () {
      let token = localStorage.getItem('itcast_manager')
      // 返回对象
      return { Authorization: token }
    },
    // 上传成功时的钩子
    handleSuccess (response, file, fileList) {
      console.log(response, file, fileList)
      if (response.meta.status === 200) {
        this.goodsForm.pics.push({ pic: response.data.tmp_path })
        this.$message.success(response.meta.msg)
      } else {
        this.$message.error('上传失败，请重试')
      }
    },
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      console.log(file, fileList)
      let temp = file.response.data.tmp_path
      for (var i = 0; i < this.goodsForm.pics.length; i++) {
        if (this.goodsForm.pics[i].pic === temp) {
          this.goodsForm.pics.splice(i, 1)
          break
        }
        console.log(file, fileList)
      }
    },
    // 点击已上传的文件链接时的钩子
    handlePreview (file) {
      console.log(file)
    }
  },
  mounted () {
    getAllCateList(3).then(res => {
      // console.log(res)
      this.cateList = res.data.data
    })
  }
}
</script>
<style lang="less" scoped>
</style>
