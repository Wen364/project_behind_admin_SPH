<template>
  <div class="charts" ref="chart" ></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name:'LineChart',
    mounted() {
        // 初始化 echarts实例
        let myChart = echarts.init(this.$refs.chart)
        // 配置数据
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
                    type:'line',
                    data:[25,15,35,38,35,70,25,42,64,78,50],
                    // 设置拐点的样式
                    itemStyle:{
                        opacity:0
                    },
                    areaStyle:{
                        color:{
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'purple' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                            }
                    },
                    lineStyle:{
                        color:'purple'
                    },
                    smooth:true
                }
            ],
            grid:{
                left:0,
                right:0,
                top:0,
                bottom:0
            }
        })
    },
}
</script>

<style scoped>
.charts{
    width: 100%;
    height: 100%;
}
</style>