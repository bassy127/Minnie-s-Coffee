<template>
    <div class="order-item">
        <slot name="itemInfo"></slot>
        <slot name="number"></slot>
        <slot name="div"></slot>
        <!-- 购物车列表 -->
        <div class="itembox" v-for="(v,i) in orderList" :key="i">
            <div class="card">
                <div class="fr">
                    <img :src="v.small_img" @click="toTargetUrl(v.pid)">
                    <div class="desc">
                        <div>
                            <p class="cName">
                                {{v.name}}
                                <span>{{v.rule}}</span>
                            </p>
                            <p class="eName">{{v.enname}}</p>
                        </div>
                        <div class="price-box">
                            <span class="price fa fa-jpy">{{v.price}}</span>
                            <div class="countBtn" v-show="v.count">
                                x{{v.count}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "../assets/less/orderItem.less"
    export default {
        name: "OrderItem",
        props:["orderList"],

        methods:{
            toTargetUrl(pid){
                this.$router.push({name: "Detail",params:{pid}})
            },
        }
    }
</script>
