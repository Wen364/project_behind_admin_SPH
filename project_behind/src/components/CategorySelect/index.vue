<template>
  <div>
    <!-- 设置 inline 属性可以让表单域变为行内的表单域 
        就是一行可以放置多个表单元素，例如一行放多个 select 下拉框
        model	表单数据对象	object	 用来获取表单的数据
    -->
    <el-form :inline="true" :model="categoryForm" class="demo-form-inline">
        <!-- 一级分类 -->
      <el-form-item label="一级分类" >
        <el-select v-model="categoryForm.category1Id" placeholder="请选择" @change="getSecondCategoryByFirstId" :disabled="isShow">
          <el-option :label="categoryFirst.name" :value="categoryFirst.id" v-for="(categoryFirst, index) in categoryFirstList" :key="categoryFirst.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 二级分类 -->
      <el-form-item label="二级分类" >
        <el-select v-model="categoryForm.category2Id" placeholder="请选择" @change="getThirdCategoryBySecondId" :disabled="isShow">
            <el-option :label="categorySecond.name" :value="categorySecond.id" v-for="(categorySecond, index) in categorySecondList" :key="categorySecond.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 三级分类 -->
      <el-form-item label="三级分类">
        <el-select v-model="categoryForm.category3Id" placeholder="请选择" @change="getThirdCategoryId" :disabled="isShow">
            <el-option :label="categoryThird.name" :value="categoryThird.id" v-for="(categoryThird, index) in categoryThirdList" :key="categoryThird.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  // 用来实现当点击了添加属性按钮后,三级联动select 就不可以被点击了的效果
  props:['isShow'],
  data() {
    return {
        categoryForm: {
          category1Id: '',
          category2Id: '',
          category3Id: ''
        },
        // 一级分类数据
        categoryFirstList:[],
        // 二级分类数据
        categorySecondList:[],
        // 三级分类数据
        categoryThirdList:[],
    }
  },
  methods: {
    onSubmit() {
        console.log('submit!');
      },
    // 获取一级分类数据
    async getCategoryFirstList(){
        // 向服务器发请求来请求数据
        let result =  await  this.$api.attr.reqGetFirstCategoryList()
        // console.log(result);
        if(result.code == 200){
            // 一级分类数据  
            this.categoryFirstList = result.data
        }else{
            alert('error!!!  getCategoryFirstList')
        }
    },
    // 一级分类的select事件的回调  当一级分类被选择了，则得到一级分类的id，并向服务器发请求，获取二级分类数据
    async getSecondCategoryByFirstId(){
        // 当一级分类选择内容改变了时，则还需要先清空二三级数据和id，再重新获取一级分类的数据
        // 清空二级分类数据的内容
        this.categorySecondList = []
        // 清空三级分类数据的内容
        this.categoryThirdList = []
        // 清空三级分类id
        this.categoryForm.category3Id = ''
        // 清空二级分类id
        this.categoryForm.category2Id = ''

        // 获取 一级分类的 id   因为select组件绑定的是 categoryForm.category1Id 
        const {category1Id} = this.categoryForm

        // 把该组件的 id 传给父组件，并要标记是几级分类
        this.$emit('getCategoryId',{categoryId:category1Id,level:1})

        // 向服务器发请求，获取对应的一级分类下的二级分类的数据
        let result = await this.$api.attr.reqGetSecondCategoryListByFirst(category1Id)
        // console.log(result);
        // 判断是否成功
        if(result.code == 200){
          this.categorySecondList = result.data
        }else{
          alert('error!!! getSecondCategoryByFirstId')
        }
    },
    // 二级分类的select事件回调    当二级分类被选择了，通过该二级分类的id，向服务器发送请求，来获取三级分类数据
    async getThirdCategoryBySecondId(){
      // 当二级分类的数据改变时，则清空三级分类数据和 id
      // 清空三级分类数据
      this.categoryThirdList = []
      // 清空三级分类id
      this.categoryForm.category3Id = ''

      // 解构出二级分类的id 
      const {category2Id} = this.categoryForm

      // 把该组件的 id 传给父组件，并要标记是几级分类
      this.$emit('getCategoryId',{categoryId:category2Id,level:2})

      // 向服务器发请求，获取该二级分类下的三级分类的数据
      let result = await this.$api.attr.reqGetThirdCategoryListBySecond(category2Id)
      if(result.code == 200){
        this.categoryThirdList = result.data
      }else{
        alert('error!! getThirdCategoryBySecondId')
      }
    },
    // 三级分类的select事件回调 当三级分类被选择完毕，则会通过他们的总的 id 来向服务器发请求获取数据
    async getThirdCategoryId(){
      // 通过解构categoryForm 来获取对应的 id
      const {category3Id} = this.categoryForm

      // 把该组件的 id 传给父组件，并要标记是几级分类
      this.$emit('getCategoryId',{categoryId:category3Id,level:3})
    }
  },
  mounted() {
    // 组件挂载完毕，向服务器发请求，获取相应的一级分类的方法
    this.getCategoryFirstList()
  },
};
</script>

<style>
</style>