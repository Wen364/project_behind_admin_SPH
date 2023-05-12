<template>
  <div>
    <el-row :gutter="10">

        <el-col :span="6">
            <el-card >
                <!-- 第一个Card -->
                <Detail title="总销售额" count="￥ 126560">
                    <template slot="charts">
                        <span >周同比 &nbsp;&nbsp;&nbsp;&nbsp; 56.67%<svg style="vertical-align:middle;" t="1683718762844" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2363" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" fill="#1afa29" p-id="2364"></path></svg></span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;<span>日同比&nbsp;&nbsp;&nbsp;&nbsp;19.96%<svg style="vertical-align:middle;" t="1683718821312" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3423" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#d81e06" p-id="3424"></path></svg></span>
                    </template>
                    <template slot="footer">
                        <span>日销售额￥&nbsp;&nbsp;&nbsp;&nbsp; 12423</span>
                    </template>
                </Detail>
            </el-card>
        </el-col>

         <el-col :span="6">
            <el-card >
                <!-- 第二个Card -->
                <Detail title="访问量" count="88460">
                    <!-- 折线图 -->
                    <template slot="charts">
                        <LineChart/>
                    </template>
                    <template slot="footer">
                        <span>日访问量&nbsp;&nbsp;&nbsp;&nbsp; 1234</span>
                    </template>
                </Detail>
            </el-card>
        </el-col>

         <el-col :span="6">
            <el-card >
                <!-- 第三个Card -->
                <Detail title="支付笔数" count="88460">
                    <!-- 柱状图 -->
                    <template slot="charts">
                        <BarChart></BarChart>
                    </template>
                    <template slot="footer">
                        <span>转化率&nbsp;&nbsp;&nbsp;&nbsp;65%</span>
                    </template>
                </Detail>
            </el-card>
        </el-col>

         <el-col :span="6">
            <el-card >
                <!-- 第四个Card -->
                <Detail title="运营活动效果" count="78%">
                    <template slot="charts">
                        <ProgressChart></ProgressChart>
                    </template>

                    <template slot="footer">
                        <span >周同比 &nbsp;&nbsp;&nbsp;&nbsp; 56.67%<svg style="vertical-align:middle;" t="1683718762844" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2363" width="16" height="16"><path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z" fill="#1afa29" p-id="2364"></path></svg></span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;<span>日同比&nbsp;&nbsp;&nbsp;&nbsp;19.96%<svg style="vertical-align:middle;" t="1683718821312" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3423" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#d81e06" p-id="3424"></path></svg></span>
                    </template>
                </Detail>
            </el-card>
        </el-col>
    </el-row>
    
  </div>
</template>

<script>
import ProgressChart from './ProgressChart/index.vue'
import BarChart from './BarChart/index.vue'
import Detail from './Detail/index.vue'
import LineChart from './LineChart'
export default {
    name:'Card',
    components:{Detail,LineChart,BarChart,ProgressChart}
}
</script>

<style>

</style>