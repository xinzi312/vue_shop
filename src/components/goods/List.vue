<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" >
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8" >
                    <el-input placeholder="请输入内容"  v-model="query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <el-table
            :data="goodslist"
            border
            style="width: 100%"
            stripe>
               <el-table-column type="index" label="#">
               </el-table-column>
                <el-table-column
                prop="goods_name"
                label="商品名称"
                width="580"
                >
                </el-table-column>
                <el-table-column
                prop="goods_price"
                label="商品价格(元)"
                width="100"
                >
                </el-table-column>
                <el-table-column
                prop="goods_weight"
                label="商品重量"
                width="100"
                >
                </el-table-column>
                <el-table-column  label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.add_time|dataFormat}}</span>
                    </template>

                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini"  icon="el-icon-edit" ></el-button>
                        <el-button type="danger" size="mini"  icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)" ></el-button>
                    </template>
                </el-table-column>
            </el-table>    

             <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.pagenum"
            :page-sizes="[5, 8, 9, 12]"
            :page-size="this.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            pagenum:1,
            pagesize:5,
            query:'',
            goodslist:[],
            total:0
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        async getGoodsList(){
            const {data:res}=await this.$http.get('goods',{
               params:{
                   query:this.query,
                   pagenum:this.pagenum,
                   pagesize:this.pagesize
               }
            })
            if(res.meta.status!==200){
                console.log(res.meta)
                return this.$message.error('获取列表失败')
            }
            this.goodslist=res.data.goods
            this.total=res.data.total
            this.$message.success('获取列表成功')
            // console.log(this.goodslist)

        },
        handleSizeChange(newSize){
            this.pagesize=newSize
             this.getGoodsList()
        },
        handleCurrentChange(newPage){
            this.pagenum=newPage
            this.getGoodsList()
        },
        async deleteGoods(id){
            const confirm=await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            // console.log(confirm)
            if(confirm=='cancel'){
                return this.$message.info('用户取消了操作')
            }
            else{
                const {data:res}=await this.$http.delete(`goods/${id}`)
                if(res.meta.status!==200){
                    return this.$message.error('删除商品失败')
                }
                this.getGoodsList()
            }
            
        },
        goAddpage(){
            this.$router.push('/goods/add')
        }
    }
}
</script>

<style lang="less" scoped>

</style>