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
                max:100,
                min:0
                
            },
            yAxis:{
                // y轴隐藏
                show:false,
                // 均分
                type:'category'
            },
            series:[
                {
                    type:'bar',
                    data:[78], 
                    color:'yellowgreen',
                    // 柱状图的宽度
                    barWidth:15,
                    showBackground:true,
                    backgroundStyle:{
                        color:'#eee'
                    },
                    label:{
                        show:true,
                        formatter:'|',
                        position:'right'
                    }
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