<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="logo"></div>
        <el-menu
        :unique-opened='true'
        :router='true'
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"

        >
          <el-submenu :index="first.path+''" v-for="first in menuList" :key="first.id" >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{first.authName}}</span>
            </template>
            <el-menu-item :index="'/home/'+second.path" v-for="second in first.children" :key="second.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{second.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
            <span><i class="myicon-menu"></i></span>
            <span class="system-title">电商后台管理系统</span>
            <a href="#" class="welcome">退出</a>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLeftMenu } from '@/api/right_index.js'
export default {
  data () {
    return {
      menuList: ''
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  mounted () {
    getLeftMenu()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.menuList = res.data.data
        }
      })
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;

    // margin: 0 auto;

  }
  .system-title{
      font-size: 28px;
      text-align: center;
       color: #fff
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
    // height: 200px;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .myicon-menu{
      color: #fff;
      font-size: 36px
  }
  .welcome{
    color: white;
  }
}
</style>
