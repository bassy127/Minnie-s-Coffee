<template>
    <div class="order">
        <van-nav-bar left-arrow fixed @click-left="goback">
            <template #title>
                我的订单
            </template>
        </van-nav-bar>

        <div class="order-box">
            <div class="bg"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Order",
    data(){
        return{

        }
    },
    created(){

    },
    methods:{
        // 放回上一级
        goback(){
            this.$router.go(-1);
        },
    }
}
</script>
