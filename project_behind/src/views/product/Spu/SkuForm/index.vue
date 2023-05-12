<template>
  <div>
      <el-form ref="form"  label-width="80px" :model="skuList">
          <!-- SPU名称 -->
          <el-form-item label="SPU名称">
            {{spuName}}
          </el-form-item>
          <!-- SKU名称 -->
          <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuList.skuName"></el-input>
          </el-form-item>
          <!-- 价格 -->
          <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" v-model="skuList.price" type="number"></el-input>
          </el-form-item>
          <!-- 重量 -->
          <el-form-item label="重量(千克)">
            <el-input placeholder="重量(千克)" v-model="skuList.weight"></el-input>
          </el-form-item>
          <!-- 规格描述 -->
          <el-form-item label="规格描述">
            <el-input placeholder="规格描述" type="textarea" rows="3" v-model="skuList.skuDesc"></el-input>
          </el-form-item>
          <!-- 平台属性 -->
          <el-form-item label="平台属性" >
            <!-- 再来一个 行内的 form 表单 -->
            <el-form :inline="true" ref="form"  label-width="80px">
              <!-- 屏幕尺寸 -->
              <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="index">
                <el-select  placeholder="请选择"  v-model="attr.attrIdAndValueId" style="margin: 0 0 5px 0">
                  <el-option :label="attrValue.valueName" :value="`${attr.id}-${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
                </el-select>
              </el-form-item>
             
            </el-form>
          </el-form-item>
          <!-- 销售属性 -->
           <el-form-item label="销售属性" >
            <!-- 再来一个 行内的 form 表单 -->
            <el-form :inline="true" ref="form"  label-width="80px">
              <!-- 颜色 -->
              <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
                <el-select  placeholder="请选择" v-model="saleAttr.saleAttrIdAndValueId">
                  <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}-${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"></el-option>
                </el-select>
              </el-form-item>
            </el-form>

          </el-form-item>
          <!-- 底部表格 -->
          <el-form-item label="图片列表" >
            <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
                <!-- 复选框 -->
                <el-table-column prop="prop" label="" width="50"  type="selection"></el-table-column>
                <!-- 图片 -->
                <el-table-column prop="prop" label="图片" width="width" align="center">
                  <template slot-scope="{row,$index}">
                    <!-- {{row}} -->
                    <img :src="row.imgUrl" alt="" style="height:100px" width="100px">
                  </template>
                </el-table-column>
                <!-- 名称 -->
                <el-table-column prop="imgName" label="名称" width="width" align="center"></el-table-column>
                <!-- 操作 -->
                <el-table-column prop="prop" label="操作" width="width" align="center">
                  <template slot-scope="{row,$index}">
                    <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
                    <el-button type="success" v-else>默认</el-button>
                  </template>
                    
                </el-table-column>   
          </el-table>  
          </el-form-item>
          <!-- 保存和取消按钮 -->
          <el-form-item label="">
            <el-button type="primary" @click="saveSkuInfo">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
          
      </el-form>
  </div>
</template>

<script>
export default {
    name:'SkuForm',
    data() {
      return {
        // spu的名字
        spuName:'',
        // 收集 sku 数据
        skuList:{
            category3Id: '',
            price: '',
            skuAttrValueList: [
              // {
              //   attrId: '',
              //   valueId: '',
              // },
            ],
            skuDefaultImg: "",
            skuDesc: "",
            skuImageList: [
              // {
              //   id: 0,
              //   imgName: "",
              //   imgUrl: "",
              //   isDefault: "",
              //   skuId: 0,
              //   spuImgId: 0,
              // },
            ],
            skuName: "",
            skuSaleAttrValueList: [
              // {     
              //   saleAttrId: '',
              //   saleAttrValueId: '',
              // },
            ],
            spuId: '',
            tmId: '',
            weight: "",
        },
        // 存储图片的信息
        spuImageList:[],
        // 存储销售信息的数据
        spuSaleAttrList:[],
        // 存储平台属性的数据
        attrInfoList:[],
        // 存放 spuImg的临时地方
        imgList:[]
      }
    },
    methods: {
      // 通过父组件通知，然后向服务器发请求来获取数据
      async getData({spu,spuId,category1Id,category2Id,category3Id}){
        // 收集 spuName 、 tmId 、 category3Id spuId
        this.spuName = spu.spuName
        this.skuList.spuId = spuId
        this.skuList.tmId = spu.tmId 
        this.skuList.category3Id = spu.category3Id

        // 获取图片
        let resultSpuImageList = await this.$api.spu.reqGetSpuImageList(spuId)
        if(resultSpuImageList.code == 200){
          // 赋值
          let list  = resultSpuImageList.data
          // 为每个字段都加入 isDefault 字段，给服务器传递参数的时候需要
          list.forEach((item)=> {
            item.isDefault = 0
          })
          // 赋值
          this.spuImageList = list
  
        }else{alert('Error resultSpuImageList')}
        // console.log(resultSpuImageList,'resultSpuImageList');

        // 获取销售属性数据
        let resultSpuSaleAttrList = await this.$api.spu.reqGetSpuSaleAttrList(spuId)
        if(resultSpuSaleAttrList.code == 200){
          // 赋值
          this.spuSaleAttrList = resultSpuSaleAttrList.data
        }else{alert('Error resultSpuSaleAttrList')}
        // console.log(resultSpuSaleAttrList,'resultSpuSaleAttrList');

        // 获取商品基本属性
        let resultAttrInfoList = await this.$api.spu.reqGetAttrInfoList({category1Id,category2Id,category3Id})
        // console.log(resultAttrInfoList,'resultAttrInfoList');
        if(resultAttrInfoList.code == 200){
          // 赋值
          this.attrInfoList = resultAttrInfoList.data
        }else{alert('Error resultAttrInfoList')}
      },
      // 勾选 复选框来 获取参数 ，elementUI自带的方法 返回的参数对象的数据 
      handleSelectionChange(params){
        // console.log(params);
        this.imgList = params
      },

      // 改变默认   排他思想
      changeDefault(row){
        this.spuImageList.forEach((item) => {
          item.isDefault = 0
        })
        row.isDefault = 1
        // 整理默认sku图片地址
        this.skuList.skuDefaultImg = row.imgUrl
      },

      // 取消按钮事件
      cancel(){
        // 触发父组件的自定义事件
        this.$emit('changeScenes',0)
        // 清除数据
        Object.assign(this._data,this.$options.data())
      },

      // 保存按钮事件
      async saveSkuInfo(){
        // 整理参数
        // 平台属性
        const {attrInfoList,skuList,spuSaleAttrList,imgList} = this
        // 空数据，存数据
        // 方案一
        //#region 
        // let arr = []
        // attrInfoList.forEach(item =>{
        //   if(item.attrIdAndValueId){
        //     let flag = item.attrIdAndValueId.split('-')
        //     let obj = {attrId:flag[0],valueId:flag[1]}
        //     // 把得到的数据先放到存数据的空数组里
        //     arr.push(obj)
        //   }
        // })
        // // 赋值
        // skuList.skuAttrValueList = arr
        //#endregion
        
        // 方案二
        let result = attrInfoList.reduce((pre,item) => {
          if(item.attrIdAndValueId){
            let [attrId,valueId] = item.attrIdAndValueId.split('-')
            let obj = {attrId,valueId}
            pre.push(obj)
          }
          return pre
        },[])
        this.skuList.skuAttrValueList = result

        // 销售属性
        let result1 = spuSaleAttrList.reduce((pre,item) => {
          if(item.saleAttrIdAndValueId){
            const [saleAttrId,saleAttrValueId] = item.saleAttrIdAndValueId.split('-')
            let obj = {saleAttrId,saleAttrValueId}
            pre.push(obj)
          }
          return pre
        },[])
        this.skuList.skuSaleAttrValueList = result1

        // 图片数据
        this.skuList.skuImageList = imgList

        // 发请求
        let reqResult = await this.$api.spu.reqSaveSkuInfo(skuList)
        // console.log(reqResult);
        // 判断
        if(reqResult.code == 200){
          this.$message({type:'success',message:'保存成功'})
          this.$emit('changeScenes',0)
        }else{
          this.$message.error('保存失败')
        }
      }

      // 
    },
}
</script>

<style>

</style>