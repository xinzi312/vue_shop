<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
             <el-alert
                title="添加商品信息"
                type="info"
                show-icon>
            </el-alert>
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addRules" ref="addRuleForm" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex"
                 :before-leave="beforeTabLeave" @tab-click="tabClicked" >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader
                            v-model="addForm.goods_cat"
                            :options="catelist"
                            :props="cateProps"
                            @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                              <!-- 复选框组 -->
                              <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i">
                                </el-checkbox>         
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action:表示图片要上传到的后台api地址 -->
                        <!-- on-preview:处理图片预览效果 -->
                        <!-- on-remove:处理图片关闭事件 -->
                        <!-- list-type:指定当前预览组件的呈现的方式  -->
                        <!-- on-success:监听图片上传成功的事件 -->
                        <el-upload
                        :headers="headerObj"
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"             
                        list-type="picture"
                        :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btn_add" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>    

            <!-- 图片预览 -->
            <el-dialog
            title="预览"
            :visible.sync="imgDialogVisible"
            width="40%"
            >
            <div class="imgbox">
                 <img :src="previewPath" class="preview">
            </div>
           
            </el-dialog>
            
        </el-card>
        
         
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data(){
        return{
            activeIndex:0,
            // 添加商品的表单数据对象
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                // 商品所属的分类数组
                goods_cat:[],
                pics:[],
                // 商品的详情描述
                goods_introduce:'',
                attrs:[]
            },
            addRules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],   
                goods_price:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                    
                ],
                goods_weight:[
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                   
                ],
                goods_number:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                   
                ],  
             },
             catelist:[],
             cateProps:{
                 expandTrigger: 'hover',
                 label:'cat_name',
                 value:'cat_id',
                 children:'children'
             },
            //  动态参数列表数据
            manyTableData:[],
            // 静态属性列表数据
            onlyTableDate:[],
            // 上传图片的url地址
            uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传组件的headers请求头对象
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            previewPath:'',
            imgDialogVisible:false,
            

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res}=await this.$http.get('categories')

            if(res.meta.status!==200){
                return this.$message.error('获取商品分类失败')
            }
            this.catelist=res.data
        },
        handleChange(){
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat=[]
                return
            }
        },
        beforeTabLeave(activeName,oldActiveName){
            // activeName 即将进入的标签页名
            // oldActiveName 即将离开的标签页名

            // 阻止标签页切换
            if(oldActiveName=='0'&&this.addForm.goods_cat.length!==3){
                 this.$message.error('请先选择商品分类')
                return false
            }      
        },
        async tabClicked(){
            
            // 证明访问的是动态参数面板
            if(this.activeIndex==='1'){
              const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                  params:{sel:'many'}
              })
              if(res.meta.status!==200){
                  return this.$message.error('获取动态参数列表失败')
              }

              res.data.forEach(item=>{
                  item.attr_vals=item.attr_vals.length===0?[]:item.attr_vals.split(' ')
              })
              this.manyTableData=res.data
              
            }
            // 证明访问的是静态属性面板
            else if(this.activeIndex==='2'){
                const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                  params:{sel:'only'}
              })
              if(res.meta.status!==200){
                  return this.$message.error('获取动态参数列表失败')
              }
              this.onlyTableDate=res.data
              console.log(this.onlyTableDate)
            }
        },
        handlePreview(file){
            // 此时应该获取完整路径 url 而不是tmp_path(路径不完整)
            this.previewPath=file.response.data.url
            this.imgDialogVisible=true
        },
        handleRemove(file){
            
            // 1 获取将要删除的图片临时路径
            const filePath=file.response.data.tmp_path
            // 2 从pics数组中 找到这个图片对应的索引值
            const i=this.addForm.pics.findIndex(item=>item.pic===filePath)
            // 3 调用数组数组的splice方法 把图片信息对象 从pics数组中移除
            this.addForm.pics.splice(i,1)
           

        },
        handleSuccess(responce){ //responce 服务器返回的数据对象
             
            // 拼接得到一个图片信息对象
            const picInfo={pic:responce.data.tmp_path}
            // 将图片信息对象push到 pics数组
            this.addForm.pics.push(picInfo)
            // console.log(this.addForm)
        },
        // 添加商品
         add(){
            this.$refs.addRuleForm.validate(valid=>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项')
                }
                // 执行添加的业务逻辑
                // 深拷贝
                const form=_.cloneDeep(this.addForm)
                form.goods_cat=form.goods_cat.join(',')
                // 处理动态参数和静态属性
                this.manyTableData.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        // 接口中规定 attr_value的类型要为字符串类型
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)

                })
                this.onlyTableDate.forEach(item=>{
                    const newInfo={attr_id:item.attr_id,
                    attr_value:item.attr_vals}
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs=this.addForm.attrs
                
                // 发起请求添加商品 商品的名称必须是唯一的（会报错）
                this.getPost(form)
               
            })
        },
        async getPost(form){
              const {data:res}=await this.$http.post('goods',form)
                if(res.meta.status!==201){
                    console.log(res.meta)
                    return this.$message.error('添加商品失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
        }
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length===3){
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }

}
</script>
<style lang="less" scoped>
.el-checkbox{
    margin-right: 5px;
}
.imgbox{
   text-align: center;
}
.preview{
    width: 100%;
   
}
.btn_add{
    margin-top: 15px;
}
</style>