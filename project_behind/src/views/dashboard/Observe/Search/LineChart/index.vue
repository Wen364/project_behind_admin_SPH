<template>
  <div>
        <div class="header">
            <span style="margin-right:5px ">搜索用户数</span>
            <svg  t="1683717983268" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1453" width="26" height="26"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" fill="#000000" p-id="1454"></path></svg>
        </div>
        <div class="main" style="margin:10px 0">
            <span style="margin-right:50px; font-size:25px">12321</span>
            <span style="margin-right:10px ">17.1</span>
            <svg style="vertical-align:middle;" t="1683718762844" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2363" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" fill="#1afa29" p-id="2364"></path></svg>
            <svg style="vertical-align:middle;" t="1683718821312" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3423" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#d81e06" p-id="3424"></path></svg>
        </div>
        <div class="footer">
            <div class="charts" ref="chart"></div>
        </div>
        
  </div>
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
                                offset: 0, color: 'skyblue' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                            }
                    },
                    lineStyle:{
                        color:'skyblue'
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
.header{
    display: flex;
    align-items: center;
}
.charts{
    height: 50px;
    width: 100%;
}
</style>