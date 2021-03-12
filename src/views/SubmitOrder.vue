<template>
    <div class="submit-order">
        <van-nav-bar left-arrow fixed @click-left="goback" title="结算订单" />

        <div class="order-box">
            <div class="order-top">
                <p @click="popupAddress">选择地址<van-icon name="arrow" class="arrow"/></p>
                <div class="ares" v-show="list.length != 0">
                    <p class="p1">
                        <span class="name">{{initAddress.name}}</span>
                        <span class="tel">{{initAddress.tel}}</span>
                        <span class="default" v-show="initAddress.isDefault">默认</span>
                    </p>
                    <p class="p1">{{initAddress.address}}</p>
                </div>
            </div>
            <div class="orderlist">
                
                <OrderItem :order-list = "orderList"> <!-- 这里必须要用 - 代替驼峰 -->
                    <template #itemInfo>
                        <p class="orderinfo">订单信息</p>
                    </template>
                    <!-- <template #number>
                        <div class="number">
                            <span>NO212132313</span>
                            <span class="finish">已完成<van-icon name="delete-o" /></span>
                            <span class="doing">确认收货</span>
                        </div>
                    </template> -->
                </OrderItem>
            </div>

            <div class="order">
                <p class="time"></p>
                <div class="pay">
                    <span>共计 {{orderList.length}} 件</span>
                    <span>合计 ￥{{total}}</span>
                </div>
            </div>

            <div class="btn">
                <van-button round type="primary" 
                    block plain color="#000"
                    class="van-btn"
                    @click="pay"
                >立即结算</van-button>
            </div>


            <van-popup v-model="isPopup" position="bottom" closeable>
                <van-address-list
                    v-model="chosenAddressId"
                    :list="list"
                    default-tag-text="默认"
                    @select="changeSelectAddress"
                    @add="onAdd"
                />
            </van-popup>
        </div>
    </div>
</template>

<script>
import "../assets/less/submitOrder.less";
import OrderItem from "../components/OrderItem.vue"
export default {
    name: "SubmitOrder",
    components:{
        OrderItem
    },
    data(){
        return{
            // 截取 查询参数
            sids : this.$route.query.sid.split("-"),

            // 结算的数据
            orderList:[],

            // 弹出框
            isPopup: false,

            // 总金额
            total:0,


            // 默认地址
            initAddress:{},

            // 地址列表
            list:[],

            // 被选中的 id
            chosenAddressId: ""
        }
    },
    created(){
        // 截取 查询参数
        // let sids = this.$route.query.sid.split("-");
        // console.log(sids)
        this.getOrderInfo();

        this.getAddress()

    },
    methods:{
        // 返回上一级
        goback(){
            this.$router.go(-1);
        },

        // 获取 订单 信息
        getOrderInfo(){
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return
            };


            this.axios({
                method: "GET",
                url: this.baseUrl + "commitShopcart",
                params:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                    sids: JSON.stringify(this.sids)
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.code == 50000){

                    this.orderList = res.data.result;
            
                    this.orderList.forEach(v=>{
                        this.total += (v.price * v.count);
                    })
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


        // 弹出框
        popupAddress(){
            this.isPopup = true;
        },

        // 获取地址
        getAddress(){
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return
            };


            this.axios({
                method: "GET",
                url: this.baseUrl + "findAddress",
                params:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                }
            }).then(res=>{
                if(res.data.code == 20000){
                    res.data.result.forEach((v,index)=>{
                        v.address = `${v.province}${v.county} ${v.addressDetail}`
                        v.isDefault = Boolean(v.isDefault)

                        // 如果 是 默认地址 则将 默认显示的数据 替换为 默认地址
                        if(v.isDefault){
                            // 将 勾选的 id 设置为 默认地址
                            this.chosenAddressId = v.id;
                            this.initAddress = res.data.result[index];
                        }
                    })
                    this.list = res.data.result
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

        // 切换选中的地址
        changeSelectAddress(value){
            // 当 切换 勾选地址时 将 默认显示的地址 替换 为 选中的地址
            let data = {...value}
            this.initAddress = data
            // console.log(this.initAddress);
        },

        // 跳转到新增地址
        onAdd() {
            this.$router.push({name: "NewAddress"})
        },


        // 结算
        pay(){
            let tokenString = localStorage.getItem("tokenString")
            // 验证token值
            if(!tokenString){
                this.$toast({
                    message: "登录了才能操作~ ",
                    forbidClick: true,
                    duration: 1000
                })
                return
            };


            this.axios({
                method: "POST",
                url: this.baseUrl + "pay",
                data:{
                    appkey: this.appkey,
                    tokenString: tokenString,
                    sids: JSON.stringify(this.sids),
                    phone: this.initAddress.tel,
                    address: this.initAddress.address,
                    receiver: this.name
                }
            }).then(res=>{
                if(!this.chosenAddressId){
                    return  this.$toast({
                        message: "请选择地址",
                        forbidClick: true,
                        duration: 800
                    });
                }
                if(res.data.code == 60000){
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    });
                    return this.$router.go(-1)
                }else{
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    });
                    return this.$router.push({name: "Home"})
                }
            }).catch(error=>{
                console.log(error)
            });

        }
    }
}
</script>
