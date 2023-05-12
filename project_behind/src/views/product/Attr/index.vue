<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :isShow="isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- 添加属性 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性
        </el-button>
        <!-- 表格：展示平台属性 -->
        <el-table :data="attrInfoList" style="width: 100%" border>
          <!-- 第一列：序号 -->
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <!-- 第二列：属性名称 -->
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <!-- 第三列 属性值列表 -->
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type=""
                v-for="(value, index) in row.attrValueList"
                :key="index"
                effect="dark"
                size="medium"
                style="margin-right: 10px"
                >{{ value.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <!-- 第四列 操作 -->
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{row,$index}">
              <!-- 修改按钮 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
            
          </el-table-column>
        </el-table>
      </div>
      <!-- 第二个 el-card -->
      <!-- 添加或修改属性的结构 -->
      <!-- 套一个 div 外壳 来控制它的显示与隐藏 -->
      <div v-show="!isShowTable">
        <el-form ref="form" label-width="80px">
          <!-- 属性名 -->
          <el-form-item label="属性名">
            <!-- input 输入框 -->
            <el-input
              v-model="attrList.attrName"
              placeholder="请输入属性名"
              style="width: 180px"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 当点击当前按钮，则table表格会新增一条数据push到数组里 -->
        <!-- 添加属性值 按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 25px"
          @click="addAttrValue"
          :disabled="!attrList.attrName.length > 0"
          >添加属性值</el-button
        >
        <!-- 取消按钮（添加属性值） -->
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 10px 0"
          border
          :data="attrList.attrValueList"
        >
        <!-- 第一列： 序号 -->
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <!-- 第二列： 属性值名称 -->
          <el-table-column prop="" label="属性值名称" width="width">
            <!-- 通过作用域插槽来让对应的input框动态绑定上数据 动态绑定属性名 -->
            <template slot-scope="{ row, $index }">
  <!-- 利用添加属性值方法，给每个attrList.attrValueList里面都加入了flag，这样就可以实现每个内容的input框和文本之间的切换 -->
              <!-- 因为要让点击的span标签变成input框的时候自动聚焦，所以要给input打上一个ref 并且用$index来进行区分 -->
              <el-input 
              v-model="row.valueName" 
              placeholder="请输入属性值" 
              v-if="row.flag" 
              @blur="toSpan(row)" 
              @keyup.native.enter="toSpan(row)" 
              @click="toSpan(row)"
              :ref="$index"
              >
              </el-input>
              <span v-else  @click="toInput(row,$index)" style="display:block; height: 100%; width:574px;">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 el-popconfirm -->
                <!-- 删除按钮 -->
                <!-- 因为element-ui版本为2.13 所以它的确定按钮回调是onConfirm -->
                <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                        <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                </el-popconfirm>  
            </template>
            
              
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttrList" :disabled="!attrList.attrValueList.length">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入 lodash 里的 深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      // 一级分类Id
      category1Id: "",
      // 二级分类Id
      category2Id: "",
      // 三级分类Id
      category3Id: "",
      // 要展示的attr数据
      attrInfoList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      // 新增属性列表 | 修改属性使用
      attrList: {
        attrName: "", // 属性名
        attrValueList: [
          // 属性名里的属性值，因为可能有多个，所以为数组
          // {
          //   attrId: '',       // 属性的 id
          //   valueName: ''    // 属性名
          // }
        ],
        categoryId: "", // 三级分类的 Id
        categoryLevel: 3, // 服务器区分是几级分类
      },
    };
  },
  methods: {
    // 获取 categoryId
    getCategoryId(category) {
      // category是一个对象，由categoryId（Id） 和 level（几级分类） 组成
      // 获取一级分类Id
      if (category.level == 1) {
        this.category1Id = category.categoryId;

        // 如果一级分类Id改变了，则清空二级和三级分类Id
        this.category2Id = "";
        this.category3Id = "";
      } else if (category.level == 2) {
        // 获取二级分类Id
        this.category2Id = category.categoryId;

        // 如果一级分类Id改变了，则清空三级分类Id
        this.category3Id = "";
      } else if (category.level == 3) {
        // 获取三级分类Id
        this.category3Id = category.categoryId;
        // 向服务器发请求获取数据   一定要在获取了三级分类的Id时，才可以向服务器发请求来获取 要展示的数据
        this.getAttrInfo();
      }

      
    },

    // 获取attrInfo要展示的数据
    // 当用户确定了三级分类对应的id 就向服务器发请求，获取数据
    async getAttrInfo() {
      // 解构来获取 Id
      const { category1Id, category2Id, category3Id } = this;
      // 给服务器发请求，来获取数据
      let result = await this.$api.attr.reqAttrInfoList({
        category1Id,
        category2Id,
        category3Id,
      });
      // console.log(result);
      // 判断是否成功
      if (result.code == 200) {
        // 赋值给 attr商品展示数据
        this.attrInfoList = result.data;
      } else {
        alert("Error! getAttrInfo");
      }
    },

    // “添加属性” 按钮的回调
    addAttr(){
      // 却换table的显示与隐藏
      this.isShowTable = false

      // 清除数据 并且 获取到 category3Id 
      this.attrList = {
        attrName: "", // 属性名
        attrValueList: [
          // 属性名里的属性值，因为可能有多个，所以为数组
          // {
          //   attrId: '',       // 属性的 id
          //   valueName: ''    // 属性名
          // }
        ],
        categoryId: this.category3Id, // 三级分类的 Id
        categoryLevel: 3, // 服务器区分是几级分类 
      }
    },

    // 添加属性值
    addAttrValue() {
      // 给这个属性值这个数组添加数据
      this.attrList.attrValueList.push({
        // 这个属性id 我们不知道，所以设置为 undefined  
        // 如果我们点击了修改按钮，然后再点击添加属性值，则就会知道它的父亲的id，也就是它的id
        attrId: this.attrList.id,       // 属性的 id
        // 因为有v-model 所以动态绑定属性名
        valueName: '' ,   // 属性名
        // 加入一个flag，用来实现点击添加的属性值的 input框和 span 的切换，并让多条数据不相互影响切换
        flag:true
      })          
      // 实现新增 input框的自动聚焦
      this.$nextTick(() => {
        // 让当前数组最后一个input自动聚焦
        this.$refs[this.attrList.attrValueList.length - 1].focus()
      })
    },

    // 修改按钮的回调
    updateAttr(row){
      // console.log(row);
      // 切换 table 的显示与隐藏
      this.isShowTable = false
      // 将选中的属性赋值给 attrList
      // 由于attrList有多次嵌套，所以使用深拷贝才行，直接赋值的话，如果点击的取消按钮，还是会影响到原数据
      this.attrList = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
      this.attrList.attrValueList.forEach((item) => {
        // 通过 $set 来给每个对象加上 动态响应的flag 
          this.$set(item,'flag',false)
      })
    },

    // 实现input框 转变为 span标签
    toSpan(row){
      // console.log(row);
      // 如果输入的是 空字符串 则弹出消息来提示用户不可以
      if(row.valueName.trim().length < 1){
        this.$message('请输入一个正常的内容')
        return 
      }
      // 新增的属性值不能和已经有的相互重复
      // some方法会返回一个布尔值，该方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试
      // result 是获取的 some 方法返回的 布尔值 判断是否输入了重复的内容
      let result = this.attrList.attrValueList.some((item) => {
        if(row !== item) {
          return row.valueName == item.valueName
        }
      })
      // 如果输入重复的内容了，就弹出弹框messageBox
      if(result){
        this.$message('请不要输入重复的内容')
        return 
      }
      // 让当前元素的 flag 为 false ，来让它从 input框和 span 来 相互转化
      row.flag = false
    },

    // 实现span标签 转变为 input框
    toInput(row,$index){
      // console.log(row);
      // 切换 span标签
      row.flag = true
      
      // 实现点击当前span标签 转为input框的时候自动聚焦
      // 当点击时，不能第一时间转换为 input框，所以使用 nextTick
      this.$nextTick(function(){
        // 获取 当前 input   通过ref标签 因为是变量，所以不能使用 . 来获得它，所以使用数组 
        // 实现自动聚焦
        this.$refs[$index].focus()
      })
    },

    // 删除attrValue  不请求数据的
    deleteAttrValue(index){
      // 从当前索引值，删除一个数组元素
      this.attrList.attrValueList.splice(index,1)
    },

    // 保存 attrList  进行添加属性或者保存属性的操作
    async saveAttrList(){
      // 整理数据  需要的数据没有 flag属性，并且不能为空的valueName  所以需要过滤出去
      this.attrList.attrValueList.filter((item) => {
        // 判断是否是空的内容
        if(item.valueName != ''){
          // delete 操作符用于删除对象的某个属性
          // 删除掉 每个attrValueList里面的flag属性
          delete item.flag 
          // 能让他不被过滤出去
          return true 
        }
      })
      // 向服务器发送请求
      try {
        // 发请求
        await this.$api.attr.reqAddOrSaveAttr(this.attrList)  
        // 让 table 显示
        this.isShowTable = true
        // 弹出框: 保存成功
        this.$message({type:'success',message:'保存成功'})
        // 重新获取数据展示
        this.getAttrInfo()

      } catch (error) {
        // 弹出框: 保存失败
        this.$message({type:'danger',message:'保存失败,请重新尝试!'})
      }
    }
  },
};
</script>

<style>
</style>