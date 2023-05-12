<template>
  <div>
    <el-table style="width: 100%" border :data="skuList">
      <el-table-column prop="prop" label="序号" width="50" type="index" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width" align="center"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width" align="center"></el-table-column>
      <el-table-column prop="prop" label="默认图片" width="width" align="center">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="height:100px;width:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="查看(KG)" width="width" align="center"></el-table-column>
      <el-table-column prop="price" label="价格(元)" width="width" align="center"></el-table-column>
      <el-table-column prop="prop" label="操作" width="300" align="center">
          <template slot-scope="{row,$index}">
                <!-- 上架按钮 -->
              <el-button type="success" icon="el-icon-top" size="mini" v-if="row.isSale==1" @click="onSale(row)"></el-button>
              <!-- 下架按钮 -->
              <el-button  icon="el-icon-bottom" size="mini"   @click="cancelSale(row)" v-else></el-button>
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit()"></el-button>
              <!-- 查看按钮 -->
              <el-button type="info" icon="el-icon-warning-outline" size="mini" @click="getSkuInfo(row)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getSkuList" 
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      layout=" prev,pager,next,jumper ,-> ,total,sizes"
      :total="total">
    </el-pagination>
    <!-- 抽屉效果 
      show-close	是否显示关闭按钮	boolean	—	true
      size	Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释	number / string	-	'30%'
    -->
    <el-drawer :visible.sync="drawer" :direction="direction" :show-close="false" size="45%">
      <!-- 名称 -->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <!-- 描述 -->
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <!-- 价格 -->
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col>
      </el-row>
      <!-- 平台属性 -->
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template >
            <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin: 5px ">{{attr.attrId}}-{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <!-- 商品图片 -->
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <!-- 走马灯   -->
          <el-carousel >
            <el-carousel-item v-for="(item, index) in skuInfo.skuImageList" :key="index">
              <img :src="item.imgUrl" alt="" style="height:100%;width:100%">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>

<script>
export default {
    name:'Sku',
    data() {
      return {
        // 总页数
        total: 0,
        // 当前页数
        page: 1,
        // 每页几个数据
        limit: 5,
        // 列表展示的数据
        skuList: [],
        // 控制下架和上架
        isShow:true,
        // 点击查看按钮，通过id获取的当前sku数据 
        skuInfo:{},
        // 控制抽屉显示与隐藏
        drawer:false,
        // 控制抽屉打开的方向
        direction: 'rtl',
      }
    },
    methods: {
      // 获取 sku 页面数据
      async getSkuList(pages = 1){
        // 分页器的点击页数，会自动返回当前页数 pages 所以让 pages 默认为 1 然后点击了再把pages的值赋值给 page
        this.page = pages
        // 获取 需要的参数
        const {page,limit} = this
        // 发请求
        let result = await this.$api.sku.reqSkuList(page,limit)
        // console.log(result);
        // 判断
        if(result.code == 200){
          this.skuList = result.data.records
          this.total = result.data.total
          this.limit = result.data.size
        }else{
          alert('Error  getSkuList')
        }
      },
      // 分页器的 控制每页展示多少数据
      handleSizeChange(limit){
        this.limit = limit 
        this.getSkuList()
      },
      // sku商品 上架
      async onSale(row){
        console.log(row);
        // 获取需要传给服务器的 参数 skuId
        const skuId = row.id
        // 发请求
        let result = await this.$api.sku.onSale(skuId)
        // console.log(result);
        // 判断
        if(result.code == 200){
          // 展示 下架 按钮  
          row.isSale = 0
          // 消息框
          this.$message({type:'success',message:'下架成功'})
        }else{this.$message.error('上架失败')}
      },

      // sku商品下架
      async cancelSale(row){
        // 获取需要传给服务器的 参数 skuId
        const skuId = row.id
        // 发请求
        let result = await this.$api.sku.cancelSale(skuId)
        // console.log(result);
        // 判断
        if(result.code == 200){
          // 展示 上架 按钮
          row.isSale = 1
          // 消息框
          this.$message({type:'success',message:'上架成功'})
        }else{this.$message.error('下架失败')}
      },

      //  编辑
      edit(){
        this.$message('正在开发中')
      },

      // 获取 sku 数据 通过 skuId
      async getSkuInfo(row){
        // 控制 抽屉效果的 显示与隐藏
        this.drawer = true
        // 获取 skuId
        const skuId = row.id
        // 
        let result = await this.$api.sku.reqGetSkuById(skuId)
        // console.log(result);
        if(result.code == 200){
          this.skuInfo = result.data
        }
      }
    },
    mounted() {
      // 发请求
      this.getSkuList()
      
    },
}
</script>

<style scoped>
    /* 走马灯 样式 */
    .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  /* 通过深度选择器才可以穿透 scoped 来让下面的横线变成红球 */
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
</style>
<style >
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
  }
  .el-col{
    margin: 10px;
  }
</style>