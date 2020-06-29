<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header >
            <div>
                <img src="../assets/heima.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- 侧边栏菜单区域 -->
                <div class="toggle-button" @click="toggleCollapse">
                    |||
                </div>
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF" 
                    unique-opened 
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    :default-active="activePath"
                    >
                    <!-- 一级菜单 -->
                    <!-- 为防止点开一个菜单 所有的菜单都展开了 应该给其一个唯一的index值 
                         该处index只接收字符串不接受数值 所以转为字符串-->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                         @click="saveNavState('/'+subItem.path)">
                            <template slot="title">
                            <!--二级菜单同样要有 图标和文本 -->
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                        </el-menu-item>
                    </el-submenu> 
                </el-menu>
            </el-aside>
            <!-- 右侧内容主题 -->
            <el-main>
                <!-- 放置子组件路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
   </el-container>
</template>
<script>
export default {
    data(){
        return{
            //左侧菜单数据
            menuList:[],
            //字体图标对象
            iconsObj:{
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            //是否折叠展示
            isCollapse:false,
            //被激活的链接地址
            activePath:''
        }
    },
    created(){
        this.getMenuList(),
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            //清空sessionStorage
            window.sessionStorage.clear()
            //重定向到登录页
            this.$router.push("/login")
        },
        //获取所有的菜单
        async getMenuList(){
            const{data:res}=await this.$http.get('menus')
            console.log(res)
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.menuList=res.data
            
        },
        //点击顶部按钮 切换菜单折叠与展开
        toggleCollapse(){
            this.isCollapse=!this.isCollapse
        },
        //点击按钮 保存菜单的状态值
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath=activePath
        }
    }
}
</script>
<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
            font-size: 16px;
        }
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right:10px ;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;//线之间的距离
    cursor: pointer;

}
</style>