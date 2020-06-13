<template>
    <div class="logon_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png">
            </div>
            <!-- 登录表单区域 -->
            <!-- 使用element-ui实现登录表单  -->
            <el-form ref="loginFormRef"  :rules="loginFormRules" :model="loginForm" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <!-- el-form-item表示表单项 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="icon iconfont icon-user">       
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <!--根据element-ui提供的使用图标方式 并使用阿里图标库 -->
                    <el-input type="password" v-model="loginForm.password" prefix-icon="icon iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <!-- 使用element-ui的按钮 -->
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //登录表单的数据绑定对象
            loginForm:{
                username:'zs',
                password:'shu'
            },
            //这是表单验证规则对象
            loginFormRules:{
                //验证用户名是否合法
                username:[
                        // required表示必填项 blur表示鼠标离开的时候校验
                      { required: true, message: '请输入登录名称', trigger: 'blur' },
                       { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password:[
                    
                         { required: true, message: '请输入密码', trigger: 'blur' },
                       { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
                    
                ],
                
            },
        }
    },
      methods:{
                //点击重置按钮重置表单
                resetLoginForm(){
                    this.$refs.loginFormRef.resetFields()
                },
                login(){
                    this.$refs.loginFormRef.validate(async valid=>{
                        // console.log(valid)
                        if(!valid) return;
                        //将返回的值解构赋值为一个data属性 将其重命名为res
                      
                        const {data:res}=await this.$http.post("login",this.loginForm);
                        //如果某一个方法返回的是Promise可以用await async来简化这次操作
                        //await只能用在被async修饰的方法中
                        console.log(res)
                        if(res.meta.status!==200) return this.$message.error("登录失败！")
                        this.$message.success('登录成功!')
                        //1 将登录成功之后的token 保存到客户的seesionStorage中（token为确定登录后服务器提供的令牌 之后访问都要携带token值）
                        //1 1 项目中除了登录之外的其他API接口 必须在登录之后才能访问
                        //1.2 token只应当在当前网站打开期间生效 所以将token保存在sesssionStorage中(localStorage是持久化的存储机制 sessionStorage是会话时的存储机制)
                              //token属性在res的data属性中
                          console.log(res)    
                          window.sessionStorage.setItem('token',res.data.token)    
                        //2 通过编程式导航跳转到后台主页 路由地址是/home
                        this.$router.push('/home')

                    })
                }
            }
}
</script>
<style lang="less" scoped>
.logon_container{
    height: 100%;
    background-color: #2b4b6b;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top:50%;
    transform:translate(-50%,-50%);
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        background-color: #fff;
        transform: translate(-50%,-50%);
        img{
            width: 100%;
            height: 100%;
            // 给图片也加圆角
            border-radius:50%;
            background-color: #eee;
        }
    }
}

.login_form{
    position: absolute;
    bottom:0;
    width: 100%;
    padding: 0 20px;
    // 这里默认的form元素是box-sizing:content
    box-sizing: border-box;

}
.btns{
    display: flex;
    // 主轴上对其方式居右对其
    justify-content: flex-end;
}
</style>
