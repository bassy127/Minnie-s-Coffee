<template>
    <div class="home-box" @scroll.stop.prevent="scrollHandle">
        <!-- 搜索输入框 -->
        <div class="searchFixed">
            <div class="inp">
                <i class="logo" @click="toCover">Minnie's Coffee</i>
                <!-- <transition name="bounce"> -->
                    <form action="/">
                        <van-search class="searchBox"
                            v-model="searchValue"
                            show-action
                            shape="round"
                            :clearable="false"
                            placeholder="请输入搜索关键词"
                            @input="getSearch"
                            @clear="clearInp"
                        />
                    </form>
                <!-- </transition> -->
            </div>
        </div>

        <div v-show="showSearchResult == false">
            <!-- 轮播图 -->
            <div class="banner" >
                <van-swipe @change="changeIndex" :autoplay="3000">
                <van-swipe-item v-for="(v) in bannerDatas" :key="v.pid">
                    <img :src="v.bannerImg" @click="toTargetUrl(v.pid)">
                </van-swipe-item>
                <template #indicator>
                    <div class="indicator">
                        <span class="indicator-line" :class="{active:currentIndex===i}" v-for="(v,i) in bannerDatas.length" :key="i">
                        </span>
                    </div>
                </template>
                
                </van-swipe>
            </div>

            <!-- 线条 -->
            <div class="split-line">
                <div class="linebox">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
            </div>

            <!-- 热门推荐 -->
            <div class="hot">
                <div class="title">热门推荐</div>
                <ul class="hot-box">
                    <Product v-for="val in hotDatas" :key="val.id" :val="val">

                    <!-- <template v-slot:addbtn tag="span" class="add">+</template>
                    <template v-slot:delbtn tag="span" class="del">-</template> -->

                    </Product>

                </ul>
            </div>
        </div>
        <!-- 搜索框 -->
        <Search class="search-s" :search-list = "searchList" v-show="showSearchResult"></Search>

        <!-- <van-loading type="spinner" color="#000" vertical /> -->
    </div>
</template>

<script>
import "../assets/less/home.less"
// 导入商品组件
import Product from "../components/Product.vue"
import Search from "../components/Search.vue"

    export default {
        name:"Home",
        components:{//注册组件
            Product,
            Search
        },

        data(){
            return{
                currentIndex:0,
                bannerDatas: [],
                hotDatas:[],

                // 搜索值
                searchValue: '',
                searchList:[],
                showSearchResult: false
                
            }
        },
        created(){
            // 缓存yhis
            let self=this;
            // 添加滚动事件
            window.addEventListener("scroll",this.scrollHandle)
            
            // 调用 获取轮播图数据的函数
            this.getBannerData();

            // 调用 获取热门推荐 
            this.getHotData();
        },
        mounted(){
            document.getElementsByClassName("searchBox")[0].
            style.width="75%"
            document.getElementsByClassName("searchBox")[0].style.animation="bounce-in 1s linear"
        },
        destroyed(){
            // 销毁监听事件
            window.removeEventListener("scroll",this.scrollHandle)
        },

        methods:{
            // 切换轮播图
            changeIndex(index){
                this.currentIndex = index
            },
            // 获取轮播图数据
            getBannerData(){
                this.axios({
                    method: "GET",
                    url: this.baseUrl + "banner",
                    // get请求使用params，post请求使用data
                    params:{
                        appkey: this.appkey,
                    }
                }).then(res=>{
                    // console.log(res.data)
                    if(res.data.code ==300 ){
                        this.bannerDatas = res.data.result
                    }else{
                        console.log("请求失败")
                    }
                }).catch(error=>{
                    console.log(error);
                })
            },

            // 点击轮播图 跳转到对应的详情页
            toTargetUrl(pid){
                this.$router.push({name: "Detail",params:{pid}})
            },

            // 获取热门推荐内容
            getHotData(){
                this.axios({
                    methods: "GET",
                    url: this.baseUrl+"typeProducts",
                    params:{
                        appkey: this.appkey,
                        key: 'isHot',
                        value: 1,
                    }
                }).then(res=>{
                    // console.log(res.data);
                    if(res.data.code=500){
                        this.hotDatas = res.data.result
                    }
                }).catch(error=>{
                    console.log(error);
                })
            },
            // 输入框的动画
            scrollHandle(){
                // 获取滚动距离
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop; 
                // console.log(scrollTop)
                // 判断 当滚动距离 >=150时 输入框变大
                if(scrollTop >= 150){
                    document.getElementsByClassName("searchBox")[0].style.width="98%"
                    document.getElementsByClassName("searchBox")[0].style.animation="bounce-out 1s linear"
                }
                // 判断 当滚动距离 <150时 输入框变小
                else{
                    document.getElementsByClassName("searchBox")[0].
                    style.width="75%"
                    document.getElementsByClassName("searchBox")[0].style.animation="bounce-in 1s linear"
                }
            },

            toCover(){
                this.$router.push({path:"/"})
            },

            // 获取搜索关键子
            getSearch(val){
                this.showSearchResult = val ? true : false
                this.$toast.loading({
                    message: "搜索中...",
                    forbidClick: true,
                    duration: 0,
                });

                this.axios({
                    //请求方式
                    method: "GET",
                    url: this.baseUrl + "search",
                    params: {
                        appkey: this.appkey,
                        name:val,
                    },
                }).then((res) => {
                    console.log("res", res);
                    this.$toast.clear();
                    
                    if (res.data.code == "Q001") {
                        this.searchList = res.data.result;
                    }
                }).catch((err) => {
                    this.$toast.clear();
                    console.log("err ==> ", err);
                });
            },

            // 清空输入框
            clearInp() {
                this.searchValue = ''
                this.getSearch()
            },

            // 获取焦点
            getFocus(){
                // this.showSearchResult = true;
                // document.getElementsByClassName("searchBox")[0].style.width="98%"
                // document.getElementsByClassName("searchBox")[0].style.animation="bounce-out 1s linear"
            },
            // 失去焦点
            getBlur(){
                // this.searchValue = ''
                // this.showSearchResult = false;
                // document.getElementsByClassName("searchBox")[0].style.width="75%"
                // document.getElementsByClassName("searchBox")[0].style.animation="bounce-in 1s linear"
            }
        },
    }
</script>
