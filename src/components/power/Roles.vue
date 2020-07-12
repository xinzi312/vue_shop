<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoles">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 栅格化分别渲染不同级别权限列 -->
                        <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染第一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染第二级 -->
                             <el-col :span="19" >
                                 <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                   <el-col :span="5">
                                       <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                   </el-col>  
                                    <el-col :span="19">
                                        <!-- 第三级权限 -->
                                        <el-tag type="warning"  v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                        
                                    </el-col> 
                                 </el-row>
                             
                            </el-col>
                           
                            
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                 <el-table-column label="操作" width="300px">
                     <template slot-scope="scope">
                          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
                         <el-button size="mini" type="danger" icon="el-icon-delete" @click="delRoles(scope.row.id)">删除</el-button>
                         <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                     </template>
                 </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addRolesVisible"
            width="50%"
            @close="resetForm"
          >
            <el-form :model="addRolesForm" :rules="editRolesRules" ref="ruleFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="addRolesForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="miaoShu">
                    <el-input v-model="addRolesForm.miaoShu"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色 -->
        <el-dialog
            title="修改角色"
            :visible.sync="editRolesVisible"
            width="50%"
            @close="editResetForm"
          >
            <el-form :model="editRolesForm" :rules="addRolesRules" ref="editRuleFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="editRolesForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="miaoShu">
                    <el-input v-model="editRolesForm.miaoShu"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editResetForm">取 消</el-button>
                <el-button type="primary" @click="editSubmitForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogCloesd"

            >
            <!-- 树形控件 -->
            <el-tree :data="rightslist"
             :props="treeProps" 
             show-checkbox node-key="id" 
             default-expand-all
             :default-checked-keys="defKeys"
             ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
            </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //所有角色列表数据
            roleList:[],
            addRolesVisible:false,
            addRolesForm:{
                name:'',
                miaoShu:''
            },
            addRolesRules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                miaoShu:[    
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    {  max: 20, message: '长度在20个字符之内', trigger: 'blur' }
                ]
             },
             editRolesRules: {
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                miaoShu:[    
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    {  max: 20, message: '长度在20个字符之内', trigger: 'blur' }
                ]
             },
            editRolesVisible:false,
            // 所编辑的角色信息
            editRolesForm:{
                id:'',
                name:'',
                miaoShu:''
            },
            setRightDialogVisible:false,
            // 所有权限的数据
            rightslist:[],
            // 树形控件的属性绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },

            defKeys:[],
            // 当前即将分配权限的角色id
            roleId:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
    //  获取角色列表
      async getRolesList(){
           const {data:res}=await this.$http.get('roles')
           if(res.meta.status!==200){
             
               return this.$message.console.error('获取角色列表失败');
           }
           this.roleList=res.data
            console.log(this.roleList)
        },
        // 弹出添加角色对话框
        addRoles(){
            this.addRolesVisible=true
        },
        // 重置添加角色对话框
        resetForm() {
         this.addRolesVisible=false
         this.$refs.ruleFormRef.resetFields();
        },
        //提交添加角色
        submitForm() {
            this.$refs.ruleFormRef.validate(async valid => {
            if (valid) {
                 this.addRolesVisible=false
                 const {data:res}=await this.$http.post('roles',
                 {roleName:this.addRolesForm.name,
                 roleDesc:this.addRolesForm.miaoShu},
                 
                )
                if(res.meta.status!==201){
                      console.log(res)
                    return this.$message.error('添加角色失败')
                }
                this.$message.success('添加角色成功')
                this.getRolesList()

            } else {
                console.log('error submit!!');
                return false;
            }
         });
        },
        // 获取编辑角色信息
       async editRoles(id){
            this.editRolesVisible=true
            const {data:res}=await this.$http.get('roles/'+id)
            if(res.meta.status!==200){
                console.log(res)
                return this.$message.error("获取角色信息失败")
            }
            this.editRolesForm.id=res.data.roleId
            this.editRolesForm.name=res.data.roleName
            this.editRolesForm.miaoShu=res.data.roleDesc
        },
        // 关闭 并 重置编辑角色表单
        editResetForm(){
            this.editRolesVisible=false
            this.$refs.editRuleFormRef.resetFields();
        },
        // 提交编辑角色内容
        editSubmitForm(){
             this.$refs.editRuleFormRef.validate(async valid => {
            if (valid) {
                 this.editRolesVisible=false
                 const {data:res}=await this.$http.put('roles/'+this.editRolesForm.id,
                 {roleName:this.editRolesForm.name,
                 roleDesc:this.editRolesForm.miaoShu},
                 
                )
                if(res.meta.status!==200){
                      
                    return this.$message.error('编辑角色失败')
                }
                this.$message.success('编辑角色成功')
                this.getRolesList()

            } else {
                console.log('error submit!!');
                return false;
            }
         });
        },
        // 删除角色
       async delRoles(id){
         const confirmMes=await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>{
            return err
        })
        // console.log(confirmMes)
        if(confirmMes!=='confirm'){
            return this.$message.info('用户取消了该操作')
        }
        const {data:res}=await this.$http.delete('roles/'+id)
        if(res.meta.status!==200){
             return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getRolesList()
      },
      // 删除权限标签   
      async removeRightById(role,rightId){
        const confirm= await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirm!=='confirm'){
            return this.$message.info('用户取消了操作')
        }

        const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
            return this.$message.error('删除角色列表失败')
        }
        //为了防止调用getRolesList()会发生页面重新渲染 需要再一次手动
        //打开展开列 又由于返回的是完整的权限列表 只要重新将权限列表数据重新赋值
        role.children=res.data
      },
      // 展示分配权限的对话框
      async showSetRightDialog(role){

          this.roleId=role.id
          //递归获取三级节点的id
          this.getLeafKeys(role,this.defKeys)

          // 获取所有权限数据
          this.setRightDialogVisible=true
          // 由于渲染的是树状列表 所有根据api 路径中所携带的类型是tree   
          const {data:res}=await this.$http.get('rights/tree')
          if(res.meta.status!==200){
              return this.$message.error('获取权限数据失败')
          }
          this.rightslist=res.data
          
      },
      // 通过递归的形式获取所有三级权限的id并保存到 defKeys数组中
      getLeafKeys(node,arr){
          //如果当前node节点不包含children属性 则是三级节点
          if(!node.children){
              return arr.push(node.id)
          }

          node.children.forEach(item=>this.getLeafKeys(item,arr))
      },   
      //监听分配权限对话框的关闭事件
      setRightDialogCloesd(){
          this.defKeys=[]
      },
      //点击为角色分配权限
        async allotRights(){
          const keys=[
              ...this.$refs.treeRef.getCheckedKeys(),
              ...this.$refs.treeRef.getHalfCheckedKeys()
          ]

          const idStr=keys.join(',')

          const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})

          if(res.meta.status!==200){
              return this.$message.error('分配权限失败')
          }
          this.$message.success('分配权限成功')
          this.getRolesList()
          this.setRightDialogVisible=false
      }
    }
}
</script>
<style lang="less" scoped>
.el-tag{
    margin:7px
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>