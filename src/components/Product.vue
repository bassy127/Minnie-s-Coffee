<template>
    <li class="pp">
        <div class="top" @click="toDetail(val.pid)">
            <img :src="val.smallImg">
            <span class="tag" v-show="val.isHot == 1 ">HOT</span>
        </div>
        <div class="bottom">
            <p class="chinese">{{val.name}}</p>
            <p class="english">{{val.enname}}</p>
            <div class="price">
                <i class="fa fa-jpy">{{val.price}}</i>
                <div>
                    <slot name="addbtn" class="add"></slot>
                    <slot name="delbtn" class="del"></slot>
                </div>
                <!-- <div>
                    <span class="add">+</span>
                    <span class="del">-</span>
                </div> -->
            </div>
        </div>
    </li>
</template>

<script>
import "../assets/less/product.less"
export default {
    name: "Prouduct",
    props:{
        val:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return{
            detailDates:[]
        }
    },
    methods:{
        // 跳转到对应 pid 的商品的详情页面
        toDetail(pid){
            this.$router.push({name: "Detail",params:{pid}})
        }
    }
}
</script>
