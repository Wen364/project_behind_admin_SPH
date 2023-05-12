<template>
  <div>
    <el-card>
        <div slot="header">
            <div class="search-header">
                <span>线上热门搜索</span>
                <!-- 下拉菜单 -->
                <el-dropdown>
                    <span class="el-dropdown-link">
                        <i class="el-icon-more" ></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>黄金糕</el-dropdown-item>
                        <el-dropdown-item>狮子头</el-dropdown-item>
                        <el-dropdown-item>螺蛳粉</el-dropdown-item>
                        <el-dropdown-item >双皮奶</el-dropdown-item>
                        <el-dropdown-item >蚵仔煎</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div>
            <el-row :gutter="10">
                <el-col :span="12">
                    <LineChart></LineChart>

                </el-col>
                <el-col :span="12">
                    <LineChart></LineChart>
                </el-col>
            </el-row>
            <!-- table表格 -->
            <el-table :data="tableData" style="width: 100%; margin-top:20px" border >
                <el-table-column prop="date"  label="排名"  width="80" type="index">
                </el-table-column>
                <el-table-column prop="name" label="搜索关键字"  width="180">
                </el-table-column>
                <el-table-column prop="address" label="用户数" sortable>
                </el-table-column>
                <el-table-column prop="address" label="周涨幅" sortable>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
                layout="prev, pager, next"
                :total="1000"
                style="float:right; margin-top:10px"
                >
            </el-pagination>
        </div>
    </el-card>
  </div>
</template>

<script>
import LineChart from './LineChart'
export default {
    name:'Search',
    components:{LineChart},
    data() {
        return {
            tableData:[{}]
        }
    },
}
</script>

<style scoped>
.search-header{
    display: flex;
    justify-content: space-between;
}
</style>