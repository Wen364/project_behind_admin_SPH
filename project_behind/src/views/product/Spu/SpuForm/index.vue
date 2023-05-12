<template>
  <div>
    <el-card>
      <el-form ref="form" label-width="80px" :model="spuList">
        <!-- Spu名称 -->
        <el-form-item label="Spu名称">
          <el-input
            placeholder="SPU名称"
            v-model="spuList.spuName"
          ></el-input>
        </el-form-item>
        <!-- 品牌 -->
        <el-form-item label="品牌">
          <el-select placeholder="请选择品牌" v-model="spuList.tmId">
            <el-option :value="trade.id" :label="trade.tmName" v-for="(trade,index) in tradeMarkList" :key="trade.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- Spu描述 -->
        <el-form-item label="Spu描述">
          <el-input
            type="textarea"
            rows="4"
            placeholder="SPU描述"
            v-model="spuList.description"
          ></el-input>
        </el-form-item>
        <!-- Spu图片 -->
        <el-form-item label="Spu图片">
          <!-- 照片墙 -->
          <!-- 
            list-type	文件列表的类型	string	text/picture/picture-card
            file-list 用来设置可以多张图片  
            file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]	array
          -->
          <el-upload
            :file-list="spuImgList"
            action="dev-api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <!-- 销售属性 -->
        <el-form-item label="销售属性">
          <el-select v-model="attrIdAndName" :placeholder="`还有${unSelectSaleAttr.length}个未选择`" style="margin-right: 10px" >
            <el-option :value="`${unSelect.id}:${unSelect.name}`" :label="unSelect.name" v-for="(unSelect, index) in unSelectSaleAttr" :key="unSelect.id"></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addSaleAttr">添加销售属性</el-button>

          <!-- 表 -->
          <el-table style="width: 100%" border :data="spuList.spuSaleAttrList">
            <!-- 序号 -->
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <!-- 属性名 -->
            <el-table-column
              prop="saleAttrName"
              label="属性名"
              width="180"
              align="center"
            >
            </el-table-column>
            <!-- 属性值名称列表 -->
            <el-table-column
              prop="prop"
              label="属性值名称列表"
              width="width"
              align="center"
            >
              <template slot-scope="{row,$index}">
                <!-- {{row}} -->
                <!-- tag标签 -->
                <!--  -->
                  <el-tag
                    :key="tag.id"
                    v-for="(tag,index) in row.spuSaleAttrValueList"
                    closable
                    :disable-transitions="false"
                    @close="row.spuSaleAttrValueList.splice(index,1)"
                    >
                    {{tag.saleAttrValueName}}
                  </el-tag>
                  <!-- @keyup.enter.native="handleInputConfirm"
                    
                     -->
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @blur="handleInputConfirm(row)"
                  >
                  </el-input>
                  <!--  -->
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(row)" >添加</el-button>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              prop="prop"
              label="操作"
              width="180"
              align="center"
            >
            <template slot-scope="{row,$index}">
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spuList.spuSaleAttrList.splice($index,1) "></el-button>
            </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <!-- 保存和取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateSpuInfo">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 存储spu信息  这里可能有修改和新增俩种情况，所以先给他赋值都为空，
      // 当为修改时，会请求数据，让他获取到数据内容，新增时则可以收集数据
      spuList: 
        {
          category3Id: "",
          description: "",
          // spuId
          id: "",
          // 品牌Id
          tmId: "",
          spuImageList: [
            // {
            //   id: "",
            //   imgName: "",
            //   imgUrl: "",
            //   spuId: "",
            // },
          ],
          spuName: "",
          spuSaleAttrList: [
            //#region 
            // {
            //   baseSaleAttrId: "",
            //   id: "",
            //   saleAttrName: "",
            //   spuId: "",
            //   spuSaleAttrValueList: [
            //     {
            //       baseSaleAttrId: "",
            //       id: "",
            //       isChecked: "",
            //       saleAttrName: "",
            //       saleAttrValueName: "",
            //       spuId: "",
            //     },
            //   ],
            // },
            //#endregion
          ], 
        },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储 spu 图片信息
      spuImgList: [],
      // 存储 销售属性信息
      saleAttrList: [],
      // 收集未选择的销售属性的id和name
      attrIdAndName:''
    };
  },
  methods: {
    // 删除图片时触发
    handleRemove(file, fileList) {
      // file ： 删除的那张图片
      // fileList：剩余的图片列表
      // 注意： url 和 name 是不需要传给服务器的，所以上传前需要整理数据
      this.spuImgList = fileList
      console.log(file, fileList);
    },
    // 照片墙预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片上传成功的回调 
    handleSuccess(res,file,fileList){
      // res:服务器返回的回应
      // file：上传成功图片的信息
      // 总的图片你列表
      this.spuImgList = fileList
    },
    // 初始化Spu数据 让父组件触发，然后让父组件传Id给他 再发请求
    async initSpuData(spuId) {
      // 发请求 获取 对应 id 的 spu 数据
      let spuResultById = await this.$api.spu.reqSpuInfoById(spuId);
      // console.log(spuResultById, "spuResultById");
      // 判断
      if (spuResultById.code == 200) {
        // 赋值
        this.spuList = spuResultById.data;
      } else {
        alert("Error！ initSpuData => spuResultById");
      }

      // 发请求 获取品牌的信息
      let markResult = await this.$api.spu.reqBaseTradeMark();
      // console.log(markResult, "markResult");
      // 判断
      if (markResult.code == 200) {
        // 赋值
        this.tradeMarkList = markResult.data;
      } else {
        alert("Error！ initSpuData => markResult");
      }

      // 获取 spu图片的数据
      let spuImgResult = await this.$api.spu.reqSpuImgList(spuId);
      // console.log(spuImgResult, "spuImgResult");
      // 判断
      if (spuImgResult.code == 200) {
        // 赋值
        let result = spuImgResult.data;
        // 因为照片墙需要 name 和 url 所以需要修改下获取的数据再赋值
        result.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 修改后赋值
        this.spuImgList = result 
      } else {
        alert("Error！ initSpuData => spuImgResult");
      }

      // 获取平台销售属性
      let attrListResult = await this.$api.spu.reqBaseSaleAttrList();
      // console.log(attrListResult, "attrListResult");
      if (attrListResult.code == 200) {
        this.saleAttrList = attrListResult.data;
      } else {
        alert("Error！ initSpuData => attrListResult");
      }
    },
    //  添加销售属性  把 id  和 name  加入 spuList下的 spuSaleAttrList 里
    addSaleAttr(){
      // 通过解构来的到这两个数据
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndName.split(':')
      // 整理参数
      let newAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      // 加入到 spuList下的 spuSaleAttrList 里
      this.spuList.spuSaleAttrList.push(newAttr)
      // 清空select框
      this.attrIdAndName = ''
    },
    // el-tag 下面的添加小按钮，可以转化为input框
    showInput(row){
      // console.log(row);
      // 给每一个row都添加一个 inputVisible 控制 input框
      this.$set(row,'inputVisible',true)
      // 给每一个row都创建一个inputValue 来收集内容
      this.$set(row,'inputValue','')
      // 自动聚焦
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    
    },
    // input框 失去焦点的回调
    handleInputConfirm(row){
      console.log(row);
      // 解构出 需要的参数
      const {baseSaleAttrId,inputValue} = row
      // 判断是否为空
      if(inputValue.trim().length == 0){
        this.$message('请不要输入空字符串')
        return
      }
      // 属性值不能重复  （不能输入重复的内容）
      let res = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      if(res){
          // 整理参数
        let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
        // 新增
        row.spuSaleAttrValueList.push(newSaleAttrValue)
        // 变为button按钮
        row.inputVisible = false 
      }else{
        this.$message('不要输入重复的内容')
      }
      
    },
    // 保存按钮的回调
    async addOrUpdateSpuInfo(){
      // 整理参数  需要整理照片墙的数据（需要imgName 和 imgUrl ）
      this.spuList.spuImageList = this.spuImgList.map((item) => {
        return {
          imageName:item.name,
          imageUrl:(item.response && item.response.data) || item.url
        }
      })   
      // 发请求
      let result = await this.$api.spu.reqAddOrUpdateSpuInfo(this.spuList)
      if(result.code == 200){
        // 回到 数据页面  通知父组件，回到 0 页面 , 还要区分是 保存，还是添加
        // 修改会有 spu自带的 id 而 添加则没有
        this.$emit('changeScene',{scene:0,flag:this.spuList.id?'修改':'保存'})

        // 弹出保存成功
        this.$message({
          type:'success',
          message:'保存成功'
        })

        // 清除数据
        Object.assign(this._data,this.$options.data()) 
      }else{
        this.$message.error('保存失败')
        alert('Error!  addOrUpdateSpuInfo')
      }
      // console.log(result);
    },
    // 获取品牌和销售属性的方法，用来给父组件传递
    async getTradeAndAttr(category3Id){
       // 发请求 获取品牌的信息
       //#region 
      let markResult = await this.$api.spu.reqBaseTradeMark();
      // console.log(markResult, "markResult");
      // 判断
      if (markResult.code == 200) {
        // 赋值
        this.tradeMarkList = markResult.data;
      } else {
        alert("Error！ initSpuData => markResult");
      }
        //#endregion

       // 获取平台销售属性
       //#region 
      let attrListResult = await this.$api.spu.reqBaseSaleAttrList();
      // console.log(attrListResult, "attrListResult");
      if (attrListResult.code == 200) {
        this.saleAttrList = attrListResult.data;
      } else {
        alert("Error！ initSpuData => attrListResult");
      }
      //#endregion
      
      // 获取 category3Id
      this.spuList.category3Id = category3Id
    },
    // 取消按钮的回调
    cancel(){
      // 通知父组件，让他回到 0 页面
      this.$emit('changeScene', {scene:0,flag:''})

      // 清理数据
      // Object.assign 用来合并对象，   让data里的数据为空 
      Object.assign(this._data,this.$options.data())
    }

  
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr(){
      // 过滤里面套了个every
      let result = this.saleAttrList.filter(item => {
        return this.spuList.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  },
};
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>