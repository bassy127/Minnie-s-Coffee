<template>
    <div class="myLike-box">
        <div class="like-box">
            <van-nav-bar left-arrow fixed @click-left="goback">
                <template #title> 我的收藏 </template>
            </van-nav-bar>

            <ul class="hot-box">
                <Product v-for="val in likeData" :key="val.id" :val="val">
                    <!-- v-for="val in hotDatas" :key="val.id" :val="val" -->
                <!-- <template v-slot:addbtn tag="span" class="add">+</template>
                <template v-slot:delbtn tag="span" class="del">-</template> -->

                </Product>

            </ul>
        </div>
    </div>
</template>

<script>
import Product from "../components/Product.vue"
import "../assets/less/myLike.less"
export default {
    name: "MyLike",
    components:{
        Product
    },
    data(){
        return{
            likeData:[],
        }
    },
    created(){
        this.queryAllLike()
    },
    methods:{
        goback() {
            this.$router.go(-1);
        },


        queryAllLike(){
            let tokenString = localStorage.getItem("tokenString")

            if (!tokenString) {
                console.log("浏览器token不存在");
                return this.$router.push({ name: "Login" });
            }

            this.$toast.loading({
                message: "加载中...",
                forbidClick: true,
                duration: 0,
            });

        this.axios({
        //请求方式
            method: "GET",
            url: this.baseUrl + "findAllLike",
            params: {
                appkey: this.appkey,
                tokenString,
            },
        }).then((res) => {
            console.log("res confirmOrder ==> ", res);
            this.$toast.clear();

            if (res.data.code == 2000) {
                this.likeData = res.data.result
            }else{
                this.$toast({
                    message: res.data.msg,
                    forbidClick: true,
                    duration: 3000,
                });
                // return this.$router.push({ name: "Login" });
            }

        }).catch((err) => {
            this.$toast.clear();
            console.log("err ==> ", err);
        });
        }
    },

}
</script>
