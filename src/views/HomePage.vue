<template>
    <div class="homePage">
        
        <div>
            <!-- 二级路由 -->
            <router-view></router-view>
        </div>
        
        <!-- 搜索输入框 -->
        

        <!-- 轮播图 -->
        

        <!-- 底部导航 -->
        <!-- route：刷新后不跳转到首页 -->
        <van-tabbar v-model="activeIndex" route>
            <van-tabbar-item 
                v-for="(v,i) in tabbarData" 
                :key="i" 
                :badge="v.badge >0 ? v.badge : '' " 
                :dot="v.dot"
                :to="v.to.path"
            >
                <span>{{v.value}}</span>
                <template #icon="props">
                    <i :class="props.active ? `${v.activeClassName}` : `${v.className}` "></i>
                </template>
            </van-tabbar-item>
        </van-tabbar>

    </div>
</template>

<script>
import "../assets/less/homePage.less"
    export default {
        name: "HomePage",
        data(){
            return{
                activeIndex: 0,
                shopcarCount:0,
            }
        },
        computed:{
            // 定义底部数据
            tabbarData(){
                return [
                    {
                        className: "iconfont icon-shouye",
                        activeClassName:"iconfont icon-shouye active",
                        value:"首页",
                        to:{
                            path:"/home"
                        }
                    },
                    {
                        className: "iconfont icon-icon-",
                        activeClassName:"iconfont icon-icon- active",
                        value:"菜单",
                        to:{
                            path:"/menu"
                        }
                    },
                    {
                        className: "iconfont icon-gouwuche",
                        activeClassName:"iconfont icon-gouwuche active",
                        value:"购物车",
                        // badge:this.shopcarCount,
                        to:{
                            path:"/shopcar"
                        }
                    },
                    {
                        className: "iconfont icon-wode",
                        activeClassName:"iconfont icon-wode active",
                        value:"我的",
                        dot: false,
                        to:{
                            path:"/my"
                        }
                    }
                ]
            },
        },
        created(){
            this.getShopcarCount()
        },
        methods:{
            
            // 处理 badge显示数量，获取购物车商品条目（不是商品总数量）
            getShopcarCount(){
                let tokenString = localStorage.getItem("tokenString")

                // if(!tokenString){
                //     this.$toast({
                //         message: "请登录",
                //         forbidClick: true,
                //         duration:1000,
                //     });
                //     return;
                // }


                this.axios({
                    method: "GET",
                    url: this.baseUrl + "shopcartRows",
                    params:{
                        appkey: this.appkey,
                        tokenString: tokenString,
                    }
                }).then(res=>{
                    // 没有登录
                    if(res.data.code == 700){
                        return
                    }
                    if(res.data.code == 8000){
                        this.shopcarCount = res.data.result
                    }
                })
            }
        }
    }
</script>
