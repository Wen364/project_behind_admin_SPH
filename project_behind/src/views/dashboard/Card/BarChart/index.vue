<template>
  <div class="charts" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name:'BarChart',
    mounted() {
        // 初始化 echarts实例
        let myChart = echarts.init(this.$refs.chart)
        // 
        myChart.setOption({
            xAxis:{
                // x轴隐藏
                show:false,
                // 均分
                type:'category'
            },
            yAxis:{
                // y轴隐藏
                show:false,
            },
            series:[
                {
                    type:'bar',
                    data:[25,15,35,38,35,70,25,42,64,78,50], 
                    // color:'purple'
                }
            ],
            // 布局调试
            grid:{
                left:0,
                right:0,
                top:0,
                bottom:0
            },
            // 提示
            tooltip:{}
        })
    },
}
</script>

<style scoped>
.charts{
    height: 100%;
    width: 100%;
}
</style>