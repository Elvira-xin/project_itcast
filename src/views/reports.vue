<template>
  <div class="reports">
      <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/reports' }">数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--标签页-->
      <el-tabs v-model="activeName" >
    <el-tab-pane label="用户来源" name="first"  >
       <!-- <pie :id="id" :option="option"></pie> -->
        <!-- <Highcharts></Highcharts> -->
        <v-chart :options="data"></v-chart>
    </el-tab-pane>
    <el-tab-pane label="数据统计2" name="second" >配置管理</el-tab-pane>
    <el-tab-pane label="数据统计3" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="数据统计4" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>

  </div>
</template>

<script type="module">

</script>
<script>
import { getReportsData } from '@/api/reports_index.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
// //----------------------------------------
import Bing from '@/components/chart.vue'
// import HighCharts from 'highcharts'
// import Highcharts from 'highcharts'
// import Exporting from 'highcharts'
// Exporting(Highcharts);
// Highcharts.chart('container', {
//   // options - see https://api.highcharts.com/highcharts
// });
// import HighchartsMore from 'highcharts/highcharts-more'
// // import HighchartsDrilldown from 'highcharts/modules/drilldown'
// // import Highcharts3D from 'highcharts/highcharts-3d'
// // HighchartsMore(Highcharts)
// // HighchartsDrilldown(Highcharts)
// // Highcharts3D(Highcharts)
// Highcharts.chart('container', {
//   // 配置
//   components: { 'highcharts-component': Highcharts }
// })

export default {
  data () {
    return {
      data: {},
      activeName: 'first'
    }
  },
  components: { 'v-chart': ECharts   },
  // components: { 'highcharts-component': Highcharts3D },
  mounted () {
    getReportsData(1)
      .then(res => {
        // console.log(res)
        this.data = res.data.data
      })
  }

}
</script>

<style lang="less" scoped>
// .reports{
//     width: 100%;
//     height: 100%;
// }
.echarts {
  width: 1300px;
  height: 500px;
}
</style>
