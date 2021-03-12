<template>
    <div class="searchItem">
        <div class="result" v-if="searchList.length !=0">
            <div class="bg"></div>
            <div class="result-item">
                <div class="result-box" v-for="(v,i) in searchList" :key="i" @click="toDetail(val.pid)">
                    <img :src="v.smallImg" >
                    <p class="cname">{{v.name}}</p>
                    <p class="ename">{{v.enname}}</p>
                    <p class="price">￥{{v.price}}</p>
                </div>
            </div>
        </div>
        <van-empty v-else description="正在努力备货中..." />
    </div>
</template>

<script>
import "../assets/less/search.less"
export default {
    name:"Search",
    data(){
        return{

        }
    },
    props:["searchList"],

    created(){
    },
    methods:{
        // 跳转到对应 pid 的商品的详情页面
        toDetail(pid){
            this.$router.push({name: "Detail",params:{pid}})
        }
    },
}
</script>
