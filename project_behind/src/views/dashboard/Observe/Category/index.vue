<template>
  <div>
    <el-card>
        <div slot="header">
          <div class="category">
            <span style="padding-bottom: 15px">销售额类别占比</span>
            <el-radio-group v-model="radios" class="radio-group">
              <el-radio-button label="全部渠道"></el-radio-button>
              <el-radio-button label="线上"></el-radio-button>
              <el-radio-button label="门店"></el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div>
          <div class="charts" ref="chart"> </div>
        </div>
        
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name:'Category',
    data() {
      return {
        radios:'全部渠道'
      }
    },
    mounted() {
      let myChart = echarts.init(this.$refs.chart)

      myChart.setOption({
            title:{
              text:'视频',
              subtext:'1048',
              left:'center',
              top:'center'
            },
            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: true,
                  position: 'outside'
                },
                labelLine: {
                  show: true
                },
                data: [
                  { value: 1048, name: '视频' },
                  { value: 735, name: 'Direct' },
                  { value: 580, name: 'Email' },
                  { value: 484, name: 'Union Ads' },
                  { value: 300, name: 'Video Ads' }
                ]
              }
            ]
          })
      // 鼠标移入事件
      myChart.on('mouseover', (params) =>{
        // 获取鼠标移上去的当前元素数据
          const {name,value} = params.data
        // 重新设置标题
        myChart.setOption({
          title:{
            text:name,
            subtext:value
          }
        })
      });
    },
}
      
</script>

<style scoped>
.category{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
>>>.el-card__header{
  padding-bottom: 0;
}
>>>.radio-group{
  position: absolute;
  right: 0px;
  top: -10px;
}
.charts{
  width: 100%;
  height: 300px;
}
</style>