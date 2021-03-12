<template>
    <div class="menu-box">
        <!-- 搜索输入框 -->
        <div class="searchFixed">
            <div class="inp">
                <!-- <i class="logo">今天也要精神满满呀</i> -->
                <van-notice-bar class="logo" scrollable delay=0 speed=30 text="今天也要元气满满呀~" />
                <van-search class="searchBox"
                    shape="round"
                    clearable
                    placeholder="请输入搜索关键词"
                    @input="getSearch"
                    @focus="getFocus"
                    @blur="getBlur"
                />
            </div>
        </div>

        <div class="sidebar" v-show="showSearchResult == false">
            <!-- 左侧导航栏 -->
            <van-sidebar v-model="activeKey">
                <van-sidebar-item :title="v.typeDesc" 
                    v-for="(v) in productType" :key="v.id"
                    @click="getProductByType(v.type,v.id)"
                >
                </van-sidebar-item>
            </van-sidebar>

            <div class="product" :v-model="activeKey==currentIndex">
                <OrderItem :order-list = "orderList" ></OrderItem>
            </div>
        </div>

        <!-- 搜索框 -->
        <Search class="search-s" :search-list = "searchList" v-show="showSearchResult"></Search>

    </div>
</template>

<script>
import "../assets/less/menu.less"
import OrderItem from "../components/OrderItem.vue"
import Search from "../components/Search.vue"
export default {
    name:"Menu",
    components:{
        OrderItem,
        Search
    },
    data() {
        return {
            activeKey: 0,
            productType : [],
            currentIndex:0,


            orderList:[],



            // 搜索值
            searchList:[],
            showSearchResult: false
        };
    },
    created(){
        this.getProductType();

        this.getProductByType("latte",1);

    },
    methods:{
        
        // 获取商品类型
        getProductType(){
            this.axios({
                method: "GET",
                url: this.baseUrl + "type",
                params:{
                    appkey: this.appkey
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.code == 400){
                    this.productType = res.data.result
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    });
                }
            }).catch(error=>{
                console.log(error)
            });
        },

        // 根据商品类型获取商品接口
        getProductByType(type,index){
            this.currentIndex = index;
            // console.log(index)
            this.axios({
                method: "GET",
                url: this.baseUrl + "typeProducts",
                params:{
                    appkey: this.appkey,
                    key: "type",
                    value: type
                }
            }).then(res=>{
                if(res.data.code == 500){
                    this.orderList = res.data.result;
                    for(let i in res.data.result){
                        this.orderList[i].small_img = res.data.result[i].smallImg
                    }
                }
            }).catch(error=>{
                console.log(error)
            });
        },



        // 获取搜索关键子
        getSearch(val){
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

        // 获取焦点
        getFocus(){
            this.showSearchResult = true;
            console.log("00")
        },
        // 失去焦点
        getBlur(){
            this.showSearchResult = false;
        }
    }
}
</script>

