<template>
  <div>
    <el-card class="box-card" style="margin:10px 0">
        <!-- 头部区域 -->
        <div slot="header" class="clearfix" >
             <!-- 左侧 tab 栏 -->
            <!-- 
                        tabs 栏  
                
             -->
            <el-tabs v-model="activeName" class="tabs" style="font-size: 25px;">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visit"></el-tab-pane>
            </el-tabs>

            <!-- 头部右侧区域  -->
            <div class="header-right">
                <span @click="setDay"   style="cursor:pointer" >今日</span>
                <span @click="setWeek"  style="cursor:pointer" >本周</span>
                <span @click="setMonth" style="cursor:pointer" >本月</span>
                <span @click="setYear"  style="cursor:pointer" >本年</span>
                <!-- 日期选择器
                    value-format 修改收集日期的格式
                 -->
                <el-date-picker
                    value-format='yyyy-MM-dd'
                    v-model="date"
                    class="date"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    size="mini"
                    >
                </el-date-picker>
            </div>
        </div>
       
       <!-- 销售额内容区域 -->
       <div>
            <el-row :gutter="10">
                <el-col :span="18">
                    <!-- 柱状图容器 -->
                    <div class="chart" ref="charts"></div>
                </el-col>
                <el-col :span="6" class="right">
                    <h3 style="font-size:20px">门店{{title}}排名</h3>
                    <ul>
                        <li>
                            <span class="render">1</span>
                            <span>肯德基</span>
                            <span class="number-value">323,234</span>
                        </li>
                        <li>
                            <span class="render">2</span>
                            <span>麦当劳</span>
                            <span class="number-value">299,132</span>
                        </li>
                        <li>
                            <span class="render">3</span>
                            <span>肯德基</span>
                            <span class="number-value">283,998</span>
                        </li>
                        <li>
                            <span style="margin-right:52px">4</span>
                            <span>海底捞</span>
                            <span class="number-value">266,223</span>
                        </li>
                        <li>
                            <span style="margin-right:52px">5</span>
                            <span>西贝筱面村</span>
                            <span class="number-value">223,445</span>
                        </li>
                        <li>
                            <span style="margin-right:52px">6</span>
                            <span>汉堡王</span>
                            <span class="number-value">219,332</span>
                        </li>
                        <li>
                            <span style="margin-right:52px">7</span>
                            <span>真功夫</span>
                            <span class="number-value">204,424</span>
                        </li>
                    </ul>
                </el-col>
            </el-row>
       </div>

      
    </el-card>
  </div>
</template>

<script>
// 引入 dayjs
import dayjs from 'dayjs'
// 引入 echarts
import * as echarts from 'echarts' 
export default {
    name:'Sale',
    data() {
        return {
            activeName:'sale',
            myChart:null,
            // 收集日历数据
            date:[]
        }
    },
    methods: {
        // 今日
        setDay(){
            const day = dayjs().format('YYYY-MM-DD')
            this.date = [day,day]
        },
        // 本周
        setWeek(){
            const start = dayjs().day(1).format('YYYY-MM-DD')
            const end = dayjs().day(7).format('YYYY-MM-DD')
            this.date = [start,end]
        },
        // 本月
        setMonth(){
            const start = dayjs().startOf('month').format('YYYY-MM-DD')
            const end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.date = [start,end]
        },
        // 本年
        setYear(){
            const start = dayjs().startOf('year').format('YYYY-MM-DD')
            const end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.date = [start,end]
        }
    },
    // 计算一下 title 
    computed: {
        title(){
            return (this.activeName=='sale'?'销售额':'访问量')
        }
    },
    // 监听
    watch: {
        title(){
            // 配置数据
            // 配置可以再次修改
            let option = null 
            if(this.activeName == 'sale'){
                option = {
                    title:{
                        text:`${this.title}趋势`
                    },
                    series: [
                        {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220,99,140,200,160,120]
                        }
                    ]
                }
            }else{
                option = {
                    title:{
                        text:`${this.title}趋势`
                    },
                    series: [
                        {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: [110, 60, 240, 300, 290, 350, 120,130,160,220,120,80]
                        }
                    ]
                }
            }
            
            this.myChart.setOption(option)
        }
    },
    mounted() {
        // 画 echarts
        // 初始化 echarts 实例
            this.myChart = echarts.init(this.$refs.charts)
            // console.log(myChart);
            // 配置数据
            let option = {
                    title:{
                        text:`${this.title}趋势`
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                        type: 'category',
                        data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月', '九月', '十月', '十一月', '十二月'],
                        axisTick: {
                            alignWithLabel: true
                        }
                        }
                    ],
                    yAxis: [
                        {
                        type: 'value'
                        }
                    ],
                    series: [
                        {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220,99,140,200,160,120]
                        }
                    ]
                    };
            // 使用 setOption 让配置项在页面展示出来
            this.myChart.setOption(option)
    },
}
</script>

<style scoped>
.clearfix{
    position: relative;
    display: flex;
    justify-content: space-between;
}
.tabs{
    width: 100%;
    
}
.header-right{
    position: absolute;
    right: 0;
}
.header-right span {
    margin: 0 10px;
    font-size: 14px;
}
.date{
    width: 240px;
    margin: 0 0 0 10px;
}
.chart{
    height: 300px;
    width: 100%;
}
ul{
    list-style: none;
    height: 300px;
    width: 100%;
    padding: 0;
}
ul li {
    height: 10%;
    width: 100%;
    margin-bottom: 5px;
}
.render {
    float: left;
    height: 23px;
    width: 23px;
    border-radius: 50%;
    background-color: black;
    color: white;
    text-align: center;
    margin-right: 40px;
}
.number-value{
    float: right;
}
/* 使用深度选择器，才可以穿透到这个样式 */
>>>.el-card__header{
  border-bottom: none;
}
</style>