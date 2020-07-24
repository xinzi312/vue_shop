<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card> 
            <el-alert
                title="注意：只允许为第三级分类设置相关参数"
                type="warning"
                show-icon
                :closable="false">
            </el-alert>

            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span class="sel_span">选择商品分类:</span>
                    <el-cascader
                    v-model="sel_key"
                    :options="cateList"
                    :props="props"
                    @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>

                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                         <el-table-column type="expand">
                             <template slot-scope="scope">
                                 <el-tag closable @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i">
                                     {{item}}
                                 </el-tag>
                                 <!-- new tag -->
                                 <!-- 输入文本框 -->
                                 <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" 
                                @click="showInput(scope.row)">+ New Tag</el-button>
                             </template>
                         </el-table-column>
                         <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                             <template slot-scope="scope">
                                 <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                 <el-button type="danger" icon="el-icon-delete"  size="mini" @click="delAttr(scope.row.attr_id)">删除</el-button>
                             </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isBtnDisabled"  @click="addDialogVisible=true">添加属性</el-button>

                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                         <el-table-column type="expand">
                             <template slot-scope="scope" >
                                 <el-tag closable @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i">
                                     {{item}}
                                 </el-tag>
                                  <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" 
                                @click="showInput(scope.row)">+ New Tag</el-button>
                             </template>
                         </el-table-column>
                         <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                             <template slot-scope="scope" >
                                 <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                 <el-button type="danger" icon="el-icon-delete"  size="mini" @click="delAttr(scope.row.attr_id)">删除</el-button>
                             </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
               
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClose"
        >
        <!-- 添加参数的表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>    
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
        >
        <!-- 修改参数的表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>    
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
        </el-dialog>


    </div>
</template>
<script>
export default {
    data(){
        return{
            cateList:[],
            // 级联选择框双向绑定的数组
            sel_key:[],
            props:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 被激活的页签名称
            activeName:'many',
            // 动态参数的数据
            manyTableData:[],
            // 静态属性的数据
            onlyTableData:[],
            // 控制添加对话框的显示与隐藏
            addDialogVisible:false,
            // 添加参数的表单数据
            addForm:{
                 attr_name:''
            },
            addFormRules:{
               attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            // 修改参数对话框
            editDialogVisible:false,
            editForm:{
                
            },
            editFormRules:{
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取所有商品分类
        async  getCateList(){
            const {data:res}=await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获取商品分类列表失败')
            }
            this.cateList=res.data
            // console.log(this.cateList)
        },
          // 获取参数的列表数据
        async getParamsData(){
             // 证明选中的不是三级分类
            if(this.sel_key.length!==3){
                this.sel_key=[]
                this.manyTableData=[]
                this.onlyTableData=[]
                return
            }
            // 证明选中的是三级分类
            // 根据所选分类的id 和当前所处的面板 获取对应的参数
            const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,
                {params:{sel:this.activeName}
            })
            if(res.meta.status!==200){
               
                return this.$message.error('获取参数列表失败')
            }
            
            // 将字符串变为数组
            res.data.forEach((item)=>{
                item.attr_vals=item.attr_vals===''?[]:item.attr_vals.split(' ')
                
                // 控制文本框的显示与隐藏
                item.inputVisible=false
                // 文本框中输入的值
                item.inputValue=""
            })
            if(this.activeName==='many'){
                this.manyTableData=res.data
            }else{
                this.onlyTableData=res.data
            }
        },
        // 选中分类发生变化
        handleChange(){
           this.getParamsData()
        },
      
        // 标签页面板发生变化
        handleClick(){
            this.getParamsData()
        },
        // 监听添加对话框的关闭事件
        addDialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        addParams(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return
                const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName
                })

                if(res.meta.status!==201){
                    return this.$message.error('添加参数失败')
                }

                this.$message.success('添加参数成功')
                this.addDialogVisible=false
                
                this.getParamsData()
            })
        },
        // 修改参数对话框
        async showEditDialog(attrId){
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,
            {
                params:{attr_sel:this.activeName}
            })
            if(res.meta.status!==200){
                return this.$message.error('获取参数失败')
            }
            this.editForm=res.data
        //    console.log(this.editForm)
            this.editDialogVisible=true
        },
        editDialogClose(){
             this.$refs.editFormRef.resetFields();
        },
        // 提交编辑参数
        editParams(){
            this.$refs.editFormRef.validate(async valid => {
            //    console.log(this.editForm)
                if (valid) {
                   const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                       
                           attr_name:this.editForm.attr_name,
                           attr_sel:this.activeName
                       
                   })
                   if(res.meta.status!==200){
                    //    console.log(res.meta)
                       return this.$message.error('编辑参数失败')
                   }
                   this.getParamsData()
                   this.editDialogVisible=false
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 删除参数
        async delAttr(attrId){
            const msg=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)
            // console.log(msg)
            if(msg=='cancel'){
                return this.$message.info("用户取消了操作")
            }
            const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
            if(res.meta.status!==200){
                return this.$message.error('删除参数失败')
            }
            this.getParamsData()
        },
        // 文本框失去了焦点或者按enter键都会触发
        async handleInputConfirm(row) {
            // 若输入的全是空格 失去焦点清空重置
           if(row.inputValue.trim().length===0){
               row.inputValue=''
               row.inputVisible=false
               return
           }
        //    如果没有return 则证明输入的内容 需要做后续处理
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue=''
            row.inputVisible=false
            this.saveAttrVals(row)
        },

        // 将对attr_vals的操作 保存到数据库
        async saveAttrVals(row){
            
            
            // 需要发起请求 保存
            const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
                //由于服务端作为以空格字符串存储 所以要将数组转为字符串
            })
            if(res.meta.status!==200){
                return this.$message.error('修改参数失败')
            }
            this.$message.success('修改参数成功')
        },
        // 显示文本输入框
        showInput(row) {
            row.inputVisible=true
            //  让文本框自动获得焦点
            // $nextTick方法的作用 就是当row.inputVisible重置为true
            //  后 页面并没有重新渲染 此时并没有input这个元素 所以要等
            //   将页面重新渲染之后 才会指定回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除对应参数的可选项
        handleClose(i,row){
            row.attr_vals.splice(i,1)
            
            this.saveAttrVals(row)
        }
    },
    computed:{
        isBtnDisabled(){
            if(this.sel_key.length!==3){
                return true
            }
            return false
        },
        // 当前选中的三级分类的id
        cateId(){
            if(this.sel_key.length===3){
                return this.sel_key[this.sel_key.length-1]
            }
            return null
        },
        // 动态计算标题的面板
        titleText(){
            if(this.activeName==='many'){
                return '动态参数'
            }
            return '静态属性'
        }
    }
}
</script>
<style lang="less" scoped>
.cat_opt{
    margin: 15px 0;
}
.sel_span{
    margin-right:15px ;
}
.el-tag{
    margin-right: 10px;
}

  .input-new-tag {
    width: 90px;
  }
</style>