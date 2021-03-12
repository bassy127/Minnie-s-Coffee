<template>
    <div class="homePage" @scroll.stop.prevent="scrollHandle">
        <!-- 底部导航 -->
        <!-- route：刷新后不跳转到首页 -->
        <van-tabbar v-model="activeIndex" route=true>
            <van-tabbar-item 
                v-for="(v,i) in tabbarData" 
                :key="i" 
                :badge="v.badge >0 ? v.badge : '' " 
                :dot="v.dot"
                @change="togglePath()"
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



// ！！！！ 路由跳转方法二：用路由名称 跳转,注意要关闭 路由模式route




    export default {
        name: "HomePage",
        data(){
            return{
                activeIndex: 0,
                // 定义底部数据
                tabbarData:[
                    {
                        className: "iconfont icon-shouye",
                        activeClassName:"iconfont icon-shouye active",
                        value:"首页",
                        routeName: "Home"
                    },
                    {
                        className: "iconfont icon-icon-",
                        activeClassName:"iconfont icon-icon- active",
                        value:"菜单",
                        routeName: "Menu"
                    },
                    {
                        className: "iconfont icon-gouwuche",
                        activeClassName:"iconfont icon-gouwuche active",
                        value:"购物车",
                        badge:0,
                        routeName: "ShopCar"
                    },
                    {
                        className: "iconfont icon-wode",
                        activeClassName:"iconfont icon-wode active",
                        value:"我的",
                        dot: false,
                        routeName: "My"
                    }
                ],
            }
        },
        
        methods:{
            togglePath(activeIndex){
                this.$router.push({
                    name: this.tabbarData[activeIndex].routeName
                })
            }
        },
    }
</script>
