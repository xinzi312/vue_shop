<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card >
            <!-- 搜索与添加区域 -->     
            <!-- gutter组件中的间隙 -->
            <el-row :gutter="20">
                <!-- 使用elememt的栅格 span指定宽度 -->
                <el-col :span="9">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary"  @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <!-- data指定表格数据源 stripe实现隔行变色-->         
            <el-table width="100%" :data="userList" border stripe>
                <!-- 索引列 -->
                 <el-table-column type="index"></el-table-column>
                 <!-- label表格标题 prop对应的值-->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email" ></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <!-- 使用作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- 这一行的所有数据 -->
                        <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userstateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" >
                    <template slot-scope="scope">
                        <!-- 修改 -->
                       <el-button @click="showEditDialog(scope.row.id)"  type="primary" size="mini" icon="el-icon-edit"></el-button>
                       <!-- 删除 -->
                       <el-button @click="removeUserById(scope.row.id)" type="danger" size="mini" icon="el-icon-delete"></el-button>
                       <!-- 分配角色 -->
                       <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                           <!-- 鼠标放置有文字提示 enterable使鼠标离开后隐藏-->
                          <el-button type="warning" :enterable="false" size="mini" icon="el-icon-setting"></el-button>
                       </el-tooltip>        
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 
                 current-page 当前的页码
                 page-sizes 可以调整每一页的数据条数
                 page-size 当前每页显示多少条数据
                 layout指定页面上显示的布局结构-->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5,10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="addDialogClose"
        >
            <!-- 内容主体 -->
            <el-form ref="form" :model="addform" label-width="80px" :rules="addFormRules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addform.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addform.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addform.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUsers">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDiologVisible"
            width="50%"
            @close="editDialogClose"
           >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="活动名称" >
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱"  prop="email">
                    <el-input v-model="editForm.email" ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" >
                    <el-input v-model="editForm.mobile" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDiologVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data(){
        //验证邮箱的规则
        var checkEmail=(rule,value,cb)=>{
            //验证邮箱的正则表达式
            const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if(regEmail.test(value)){
                //合法邮箱
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }

        //验证手机号的规则
        var checkMobile=(rule,value,cb)=>{
            const regMobile=/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入合法手机号'))
        }
        
        return{
            //获取用户列表的参数对象
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            userList:[],

            total:0,
            dialogVisible:false,
           
            //添加用户的表单数据
            addform:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },

             editDiologVisible:false,
             //查询到的用户信息对象
             editForm:{},
            //添加用户表单验证规则
            addFormRules:{
                username:[
                     { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 7, max: 12, message: '长度在 7 到 12 个字符', trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { validator:checkEmail,  trigger: ['blur', 'change'] }
                ],
                mobile:[
                     { required: true, message: '请输入手机号', trigger: 'blur' },
                    {  validator:checkMobile,trigger: 'blur' }
                ]
            },
            //修改用户 弹框表单的校验规则
            editFormRules:{
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { validator:checkEmail,  trigger: ['blur', 'change'] }
                ],
                 mobile:[
                     { required: true, message: '请输入手机号', trigger: 'blur' },
                    {  validator:checkMobile,trigger: 'blur' }
                ]
            }
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        async getUserList(){
           const {data:res}=await this.$http.get('users',{params:this.queryInfo})
        //    console.log(res)
           if(res.meta.status!==200){
               return this.$message.error('获取用户列表失败')
           }
           this.userList=res.data.users
           this.total=res.data.total
        },

        //监听pageSize改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getUserList()
        },

        //监听页码值改变的事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getUserList()
        },

        //监听switch开关状态的改变
        async userstateChanged(userinfo){
            const {data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status!==200){
                //更新数据失败 需要将开关状态恢复到之前的样子
                userinfo=!userinfo.mg_state
                return this.$message.error('更新用户信息失败')
            }
            this.$message.success('更新状态成功')
        },
        //监听添加用户对话剧的关闭事件
        addDialogClose(){
            this.$refs.form.resetFields();
        },
        //点击确定按钮对表单进行预验证
        addUsers(){
         this.$refs.form.validate(async valid => {
            if(!valid) return

            //可以发起网络请求
            const {data:res}=await this.$http.post('users',this.addform)
            if(res.meta.status!==201){
                return this.$message.error('添加用户失败')
            }

            this.$message.success('添加用户成功')
            //隐藏添加用户的对话框
            this.dialogVisible=false
            //重新渲染列表
            this.getUserList()
        });
        },
        // 展示编辑修改对话框
        async showEditDialog(id){
            const {data:res}=await this.$http.get('users/'+id)
            if(res.meta.status!==200){
                return this.$message.error('获取用户数据失败')
            }
            this.editForm=res.data
            this.editDiologVisible=true
        },
        //表单重置
       editDialogClose(){
        this.$refs.editFormRef.resetFields()
      },
       //修改用户信息并提交
       editUserInfo(){
           this.$refs.editFormRef.validate(async valid=>{
               if(!valid) return
               
               //发起修改用户数据请求
              const {data:res}=await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
              if(res.meta.status!==200){
                  return this.$message.error('修改用户数据失败')
              }

              //关闭对话框
              this.editDiologVisible=false
              //刷新数据列表
              this.getUserList()
              //提示修改成功
              this.$message.success('更新用户信息成功')
           })
       },
       //根据id删除用户的信息
      async removeUserById(id){
           //弹框询问是否删除数据
           //该方法的返回值是一个promise 所以要用await async简化其操作
           const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .catch(err=>{
                return err
            })
            //如果用户确认删除 则返回的字符串为confim 
            //如果点击取消 则用catch捕获错误消息 并return出去 这样才不会报错 其返回的字符串为cancel
            // console.log(confirmResult)
            //如果confirmResult不为confim 说明用户不想删除则弹框取消从删除
            if(confirmResult!=='confirm'){
                return this.$message.info('已取消删除')
            }

           const {data:res}=await this.$http.delete('users/'+id)
           if(res.meta.status!==200){
               return this.$message.error('删除用户失败')
           }
           this.$message.success('删除用户成功')
           this.getUserList()
       }

    },
   
}
</script>
<style lang="less" scoped>

</style>