<template>
  <div>
    <!-- 按钮 -->
    <!-- 点击添加按钮后，对话框dialog会显示 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 15px"
      @click="addTradeMark"
      >添加</el-button
    >
    <!-- 表格组件 
      data：表格组件将来要展示的数据 ----- 数组类型
      border	是否带有纵向边框	boolean
    -->
    <el-table :data="pageList" style="width: 100%" border>
      <!-- el-table-column 表示表格的每一列
        label	显示的标题	string
        width	对应列的宽度	string
        align	对齐方式	String	left/center/right
        type="index" 表示每列展示序号
        prop	对应“列”内容的字段名，也可以使用 property 属性	string
      -->
      <el-table-column label="序号" width="80" align="center" type="index" >
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="prop"
        label="品牌LOGO"
        width="width"
        align="center"
      >
        <!-- 通过作用域插槽实现的，这个需要多看看，有点懵，希望学完回来能完全懂 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 160px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 
    当前页数，数据总数 每一页展示条数，连续页码数
    current-page	当前页数，支持 .sync 修饰符	number
    total	总条目数	number
    page-size	每页显示条目个数，支持 .sync 修饰符	number
    page-sizes	每页显示个数选择器的选项设置	number[] 例如：	[10, 20, 30, 40, 50, 100]
    pager-count	页码按钮的数量，当总页数超过该值时会折叠	number	大于等于 5 且小于等于 21 的奇数
    size-change	pageSize 改变时会触发	它的回调会返回： “每页条数”
    current-change	currentPage 改变时会触发	它的回调会返回：“当前点击的的页数”
   
    -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[2, 5, 10]"
      :pager-count="7"
      layout="  prev, pager, next, jumper, -> , sizes,total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- 点击添加和修改弹出的 dialog对话框 -->
    <!-- :visible.sync="dialogFormVisible"控制对话框的显示与隐藏 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单， :model属性，这个属性的作用是把表单的数据收集到这个对象身上，将来表单验证，也需要这个属性 -->
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
            并将 Form-Item 的 prop 属性设置为需校验的字段名即可 
      -->
      <el-form :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="品牌名称:"
          :label-width="formLabelWidth"
          prop="tmName"
        >
          <el-input
            autocomplete="off"
            style="width: 80%"
            v-model="tmForm.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="品牌LOGO:"
          :label-width="formLabelWidth"
          prop="logoUrl"
        >
          <!-- LOGO上传
          
           -->
          <!-- 这里收集数据不能使用 v-model 因为不是表单元素
            action：图片上传的地址
            on-success	文件上传成功时的钩子	function(response, file, fileList)
            on-error	文件上传失败时的钩子	function(err, file, fileList)
            before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 
            且被 reject，则停止上传。	function(file)
            -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 自定义验证规则  （品牌名字）
    const validateTmName = (rule, value, callback) => {
      if(value.length < 2 || value.length > 6 ){
        callback(new Error('请输入 2 到 6 位字符'))
      }
    }
    return {
      // 当前页码
      page: 1,
      // 每页记录数
      limit: 2,
      // 总数据条数
      total: 0,
      // 列表展示的数据
      pageList: [],
      // 对话框显示和隐藏 默认不显示
      dialogFormVisible: false,
      // 对话框里面 label的宽度
      formLabelWidth: "120px",
      // 品牌名称
      tradeName: "",
      // 表单数据（用来收集数据的）
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称验证规则
        tmName: [
          {
            // required	是否必填，如不设置，则会根据校验规则自动生成	boolean
            // message 警告提示信息
            // trigger 用户行为设置（事件的设置：blur change）
            // min 最短字符 max：最长字符
            required: true,
            message: "请输入品牌名称",
            trigger: "blur",
          },
          // 自定义校验规则  在data里定义一个函数 名字为 validateTmName
          { validator: this.validateTmName, trigger: 'change' }
          //  { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        // 品牌LOGO验证规则
        logoUrl: [
          {
            required: true,
            message: "请选择上传图片",
          },
        ],
      },
    };
  },
  methods: {
    // 获取品牌列表数据
    async getPageList() {
      // 获取品牌列表的接口
      // 因为向服务器发请求时需要带参数，所以在data里面初始化两个字段
      const { page, limit } = this;
      let result = await this.$api.tradeMark.reqTradeMarkList(page, limit);
      // console.log(result);
      if (result.code == 200) {
        const { data } = result;
        // 获取 total 和 pageList
        this.total = data.total;
        this.pageList = data.records;
      } else {
        alert("getPageList is error");
      }
    },
    // 切换页数和数据
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    // 分页器某一页需要展示的数据条数发生改变
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击新增按钮
    async addTradeMark() {
      // 先让弹出框显示
      this.dialogFormVisible = true;
      // 清空一下tmForm的数据
      this.tmForm = { logoUrl: "", tmName: "" };
    },
    // 点击修改按钮
    async updateTradeMark(row) {
      // 先让弹出框显示
      this.dialogFormVisible = true,
        // row 当前选中的品牌的信息
        // 这里因为可以点取消，所以不能让tmForm直接操作row数据，所以使用浅拷贝
        this.tmForm = { ...row };
    },
    // 图片上传成功
    handleAvatarSuccess(res, file, fileList) {
      // res 返回的是 一个对象，里面包含图片的浏览器路径
      // file 返回的是 该文件的内容，
      // console.log(res,file,fileList);
      // 把图片地址给 tmForm  收集品牌图片的数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      // const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // console.log(file);
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M ;
    },
    // 弹出框的确定按钮的方法，(添加和修改)
    async addOrUpdateTradeMark() {
      // 有时候因为服务器问题，导致图片不能获取成功，然后表单验证不了，所以不能进行下一步
      // 判断表单验证是否成功，成功的话再 向服务器请求数据
      this.$refs.ruleForm.validate(async (valid) => {
        // console.log(valid);
        // 返回的 valid 是一个布尔值 当表单验证成功了，则返回 true 否则返回 false
        if (valid) {
          // 关闭弹出框
          this.dialogFormVisible = false;
          // 解构获取数据
          const { tmForm } = this;
          // 向服务器发送数据
          // 需要判断是 修改品牌 还是 添加品牌  修改品牌需要id  而添加品牌则没有id
          if (tmForm.id) {
            // 修改品牌
            let result = await this.$api.tradeMark.updateTradeMark(tmForm);
            if (result.code == 200) {
              // 弹出信息  修改品牌成功  or  添加品牌成功
              this.$message({
                type: "success",
                message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              });
              // 重新获取品牌列表数据
              // 还需要判断一下是否留在当前页，如果是修改的话，需要留在当前页，否则回到首页
              this.getPageList(this.tmForm.id ? this.page : 1);
            }
          } else {
            // 添加品牌
            let result = await this.$api.tradeMark.reqAddTradeMark(tmForm);
            // console.log(result);
            // console.log(result);
            if (result.code == 200) {
              // 弹出信息  修改品牌成功  or  添加品牌成功
              this.$message({
                type: "success",
                message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              });
              // 重新获取品牌列表数据
              this.getPageList();
            }
          }
        }else{
          console.log('error submit!');
          return false
        }
      });

      // 当服务器获取不到 图片时，使用它来进行品牌上传和修改
      // 关闭弹出框
          // this.dialogFormVisible = false;
          // // 解构获取数据
          // const { tmForm } = this;
          // // 向服务器发送数据
          // // 需要判断是 修改品牌 还是 添加品牌  修改品牌需要id  而添加品牌则没有id
          // if (tmForm.id) {
          //   // 修改品牌
          //   let result = await this.$api.tradeMark.updateTradeMark(tmForm);
          //   if (result.code == 200) {
          //     // 弹出信息  修改品牌成功  or  添加品牌成功
          //     this.$message({
          //       type: "success",
          //       message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
          //     });
          //     // 重新获取品牌列表数据
          //     // 还需要判断一下是否留在当前页，如果是修改的话，需要留在当前页，否则回到首页
          //     this.getPageList(this.tmForm.id ? this.page : 1);
          //   }
          // } else {
          //   // 添加品牌
          //   let result = await this.$api.tradeMark.reqAddTradeMark(tmForm);
          //   console.log(result);
          //   // console.log(result);
          //   if (result.code == 200) {
          //     // 弹出信息  修改品牌成功  or  添加品牌成功
          //     this.$message({
          //       type: "success",
          //       message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
          //     });
          //     // 重新获取品牌列表数据
          //     this.getPageList();
          //   }
          // }
    },
    // 点击删除按钮
    deleteTradeMark(row) {
        this.$confirm('确定删除此品牌信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          // 成功的回调，就是点击了 弹框的 确定按钮 的回调
        }).then(async() => {
          // 通过 结构解赋 来获取 当前品牌的 id
          const {id} = row
          // 给服务器发送请求删除该品牌
          let result = await this.$api.tradeMark.deleteTradeMark(id)
          // 判断是否删除成功
          if(result.code == 200){
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
            // 再次获取品牌列表数据，并且还是在删除页，不返回首页
            // 通过判断当前页列表是否还有数据来判断是留在该页还是它的前一页
            // 有个小 bug 当前页没有数据，返回到上一页也是没有数据，
            // this.pageList.length>1?this.page:this.page-1
            if(this.pageList.length > 1){
              this.getPageList()
            }else{
              this.page--
              // 可能因为电脑反应太快了，导致分页器切换页数时，已经获取完数据了，所以数据会在上一页显示为空
              this.$nextTick(()=> {
                this.getPageList()
              })
            }
            
            //  location.replace(location.href)
          }else{
            // 删除失败
              this.$message({
              type: 'info',
              message: '删除失败！请稍后重新尝试！'
            });  
          }
          
        }).catch(() => {
          // 点击了弹框的 取消按钮 的回调
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
  },
  mounted() {
    // 获取列表数据
    this.getPageList();
  },
};
</script>

<style scoped >
/* LOGO上传的样式 */
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar-uploader-icon:hover {
  border-color: #409eff;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
