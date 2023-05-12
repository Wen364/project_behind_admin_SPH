<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动全局组件 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShow="scene!=0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示Spu数据 -->
      <div v-show="scene == 0">
        <!-- 添加 Spu 按钮 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom:20px" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <!-- Spu数据 表 -->
        <el-table  style="width: 100%; margin-bottom:20px" border :data="spuInfoList">
          <!-- 第一列： 序号 -->
          <el-table-column prop="prop" label="序号" width="80" type="index" align="center"></el-table-column>
          <!-- 第二列： spu名称 -->
          <el-table-column prop="spuName" label="spu名称" width="width" align="center"></el-table-column>
          <!-- 第三列： spu描述 -->
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <!-- 第四列： 操作 -->
          <el-table-column prop="prop" label="操作" width="width" align="center">
            <template slot-scope="{row,$index}">
              <!-- 增加按钮 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <!-- 修改按钮 -->
              <hint-button @click="updateSpu(row)" type="warning" icon="el-icon-edit" size="mini" title="修改spu"></hint-button>
              <!-- 查看按钮 -->
              <hint-button type="info" icon="el-icon-warning-outline" size="mini" title="查看当前spu全部sku列表" @click="getSkuInfo(row)"></hint-button>
              <!-- 删除按钮 -->
              <!-- 和 气泡确认框相互联合 -->
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2,5,10]"
          :page-size="limit"
          layout="  prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          style="text-align:center;"
          >
        </el-pagination>
      </div>
      
      <!-- 添加或者修改Spu数据 -->
      <!-- 通过给子组件 打上 ref标签，来获取子组件的方法和数据 -->
      <SpuForm v-show="scene == 1" @changeScene='changeScene' ref="spu"></SpuForm>

      <!-- 添加Sku -->
      <SkuForm v-show="scene == 2" ref="sku" @changeScene='changeScene' @changeScenes='changeScenes'></SkuForm>

      <!-- 查看按钮的dialog对话框 
      before-close	关闭前的回调，会暂停 Dialog 的关闭	function(done)，done 用于关闭 Dialog
      -->
      <el-dialog :title="`${spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="beforeClose">
        <el-table v-loading="loading" :data="skuInfo">
          <el-table-column property="skuName" label="名称" width="150" align="center"></el-table-column>
          <el-table-column property="price" label="价格" width="200" align="center"></el-table-column>
          <el-table-column property="weight" label="重量"></el-table-column>
          <el-table-column property="" label="默认图片">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" alt="" style="height:100px; width:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
  name: "Spu",
  data() {
    return {
      //  弹出框
      dialogTableVisible: false,
      // 分页器的 第几页
      page:1,
      // 一页几个数据
      limit: 5 ,
      // 总页数
      total: 49,
      // 
      category1Id: "",
      // 
      category2Id: "",
      // 
      category3Id: "",
      // 要展示的 spu 数据
      spuInfoList:[],
      // 控制下面的spu数据显示哪个页面  0：spu数据   1：增加或修改spu数据  2：
      scene:0,
      // 通过查看按钮，获取到对应 spuId 的 sku 数据
      skuInfo:[],
      // loading
      loading: true,
      // 点击查看按钮上面显示的当前 spuName
      spuName:''
    };
  },
  components:{SkuForm,SpuForm},
  methods: {
    // 获取Spu数据
    async getSpuList() {
      // 解构来获取需要传给服务器的参数
      // const {page,limit,category3Id} = data
      const {page,limit,category3Id} = this
      // 向服务器发送请求
      let result = await this.$api.spu.reqSpuInfoList(page,limit,category3Id)  
      // console.log(result);
      // 判断
      if(result.code == 200){
        // 赋值
        this.spuInfoList = result.data.records
        this.total = result.data.total
      }else{
        alert('Error!  getSpuList')
      } 
    },
    // 自定义事件，让子组件 CategorySelect 传来 id 让父组件获取
    getCategoryId({ categoryId, level }) {
      // categoryId: 获取到 一、二、三级分类Id   level：用来区分 几级 Id
      if (level == 1) {
        this.category1Id = categoryId;
        // 如果改变了 一级分类 还要清除 二、三级分类Id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        // 如果改变了 二级分类 还要清除 三级分类Id
        this.category3Id = "";
      } else if (level == 3) {
        this.category3Id = categoryId;
        // 发请求给服务器获取Sku列表来展示
        this.getSpuList();
      }
    },
    // 分页器 页数改变
    handleCurrentChange(page){
      // pager 属于是它自己带的参数 就是点击的页数
      // 获取当前点击的页数，并赋值给page
      this.page = page
      // 再次请求数据
      this.getSpuList()
    },
    // 分页器 每页几条数据改变
    handleSizeChange(limit){
      // 函数自带的参数
      // 获取参数
      this.limit = limit
      // 再次请求数据 
      this.getSpuList()
    },
    // 添加Spu
    addSpu(){
      // 让其页面显示
      this.scene = 1
      // 通过ref 标签来调用子组件的方法，获取数据
      this.$refs.spu.getTradeAndAttr(this.category3Id)
    },
    // 修改Spu
    async updateSpu(row){
      // 让其页面显示
      this.scene = 1
      // 获取子组件方法来发请求
      this.$refs.spu.initSpuData(row.id)
    },
    // 当子组件点击取消按钮后，通过自定义事件传来参数，控制页面显示与隐藏
    changeScene({scene,flag}){
      this.scene = scene
      // 判断
      if(flag == '修改'){
        // 获取spu数据
        this.getSpuList()
      }else{
        // 如果是添加，则返回第一页
        this.page = 1
        // 获取spu数据
        this.getSpuList()
      }
    },
    // 删除 spu
    async deleteSpu(row){
      let spuId = row.id
      
      let result = await this.$api.spu.deleteSpuInfoById(spuId)
      // console.log(result);
      if(result.code == 200){
        // 保存成功
        this.$message({type:'success',message:'删除成功'})
        // 请求数据
        if(this.spuInfoList.length>1){
          this.getSpuList()
        }else{
          this.page--
          // 防止电脑速度过快，数据获取太快而不显示数据
          this.$nextTick(()=>{
            this.getSpuList()
          })
        }
      }else{
        // 保存失败
        this.$message.error('删除失败')
        alert('Error   deleteSpu')
      }
    },
    // 添加 sku
    addSku(row){
      // 切换页面到 sku 
      console.log(row);
      this.scene = 2
      // 通知子组件 向服务器发请求 获取数据
      // 整理需要给子组件传递的参数
      let data = 
          {
            spu:row,
            spuId: row.id,
            category1Id: this.category1Id,
            category2Id: this.category2Id,
            category3Id: this.category3Id
          }
      // 通过 ref 来让父组件来调用 子组件 的 方法 和 数据
      this.$refs.sku.getData(data)
    },
    // skuForm 通知父组件修改场景 
    changeScenes(scene){
      this.scene = scene
    },
    // 点击查看按钮 获取 sku对应id 的数据
    async getSkuInfo(row){
      // 控制对话框
      this.dialogTableVisible = true
      // 
      this.spuName = row.spuName
      // 获得数据
      const spuId = row.id
      // 发请求
      let result = await this.$api.spu.reqSkuInfoBySpuId(spuId)
      // console.log(result);
      if(result.code == 200){
        // 关闭loading
        this.loading = false
        // 赋值
        this.skuInfo = result.data
      }else{
        this.loading = false
        this.$message.error('查看sku数据失败')
      }
    },
    // dialog关闭前的回调
    beforeClose(done){
      // alert(111)
      // 清空数据
      this.skuInfo = []
      // 开启loading
      this.loading = true
      // 关闭 dialog
      done()
    }
  },
};
</script>

<style>
</style>