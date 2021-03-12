<template>
    <div class="detail" >
        <van-nav-bar left-arrow fixed @click-left="goback">
            <template #title>
                <van-icon class="iconfont icon-icon-"/>
                商品详情
            </template>
        </van-nav-bar>
        <div class="top-box">
            <img :src="detailDatas.large_img">
            <MoveLine></MoveLine>
        </div>

        <div class="detail-box">
            <!-- 标题 -->
            <div class="title">
                <p>
                    <span class="fa fa-coffee">{{detailDatas.name}}</span>
                    <span>￥{{detailDatas.price}}</span>
                </p>
                <p>{{detailDatas.enname}}</p>
            </div>

            <!-- 喜好 -->
            <div class="choose-box">
                <div class="choose" v-for="(v1,i1) in detailDatas.userHobby" :key="i1">
                    <i class="iconfont icon-plus-minus">
                        &nbsp;&nbsp;{{v1.title}}：
                    </i>
                    <span v-for="(v2,i2) in v1.rule" :key="i2" 
                          :class="{active: v1.index === i2}"
                          @click="changeTag(v1, i2)"
                    >
                        &nbsp;&nbsp;{{v2.title}}
                    </span>
                </div>

                <div class="tag">
                    <i class="iconfont icon-plus-minus">
                        &nbsp;&nbsp;标签：
                    </i>
                    <span>{{detailDatas.type_desc}}</span>
                </div>
            </div>

            <!-- 数量 -->
            <div class="buyCount">
                <i class="iconfont icon-plus-minus">&nbsp;&nbsp;选择数量</i>
                <div class="countBtn">
                    <van-stepper
                        theme="round" 
                        button-size="22" 
                        disable-input
                        v-model="count"
                    />
                </div>
            </div>

            <!-- 描述 -->
            <div class="desc">
                <i class="fa fa-connectdevelop">商品描述</i>
                <p v-for="(val,i) in desc" :key="i">{{i+1}}、{{val}}</p>
            </div>
        </div>

        <!-- 加入购物车 -->
        <van-goods-action>
            <van-goods-action-icon 
                icon="shopping-cart-o" 
                text="购物车"
                :badge="shopcarCount > 0 ? shopcarCount : '' "
                to="/shopcar"
            />
            <van-goods-action-icon icon="like-o" 
                :text="iscollect ? '已收藏' : '收藏'"
                :color="iscollect ? 'red' : '#000'"
                @click="isCollect()"
            />
            <van-goods-action-button 
                color="#ccc" 
                type="warning" 
                text="加入购物车" 
                @click="addshopCar"
            />
            <van-goods-action-button color="#000" type="danger" text="立即购买" @click="buy" />
        </van-goods-action>
    </div>
</template>

<script>
import "../assets/less/detail.less";
import MoveLine from "../components/MoveLine.vue"
export default {
    name: "Detail",
    components:{
        MoveLine
    },
    data(){
        return{
            // 路由id
            pid:"",

            // 商品详情数据
            detailDatas:[],

            // 商品详情描述列表
            desc:[],

            // 是否收藏
            iscollect:false,

            // 购物车数量
            shopcarCount: 0,

            // 选择数量
            count:1,


            sids : "",

        }
    },
    created(){
        // 获取路由路径的pid
        this.pid = this.$route.params.pid

        


        this.getDetail();

        this.queryCollect();

        this.getShopcarCount();
    },
    methods:{
        changeTag(item,index){
            // 当点击相同的时候
            if(item.index == index){
                return
            }
            item.index = index
        },
        // 放回上一级
        goback(){
            // document.getElementsByClassName("detail")[0].classList.add("animate__animated animate__fadeOut")
            this.$router.go(-1);
        },


        // 获取商品详情数据
        getDetail(){
            console.log(this.sids)
            this.axios({
                method: "GET",
                url: this.baseUrl + "productDetail",
                params:{
                    appkey: this.appkey,
                    pid: this.pid
                }
            }).then(res=>{
                // console.log(res);
                if (res.data.code === 600) {
                    let result = res.data.result[0]
                    // 对数据进行处理
                    let rules = [ "sugar","tem","cream", "milk"];

                    // 给后台 数据添加一个空数组，用于存放最后处理完的 数据
                    result.userHobby = [];

                    rules.forEach((v) => {
                    //如果不存在，则不添加到data.userHobby
                    if (!result[v]) {
                        return;
                    }

                    let rulesText = result[v].split("/");

                    let currentRule = {
                        title: result[v + "_desc"],
                        index: 0,
                        rule: [],
                    };

                    rulesText.forEach((item) => {
                        let o = {
                        title: item,
                        };
                        currentRule.rule.push(o);
                    });

                        result.userHobby.push(currentRule);
                    });

                    //处理商品描述信息
                    this.detailDatas= result;
                    this.desc = result.desc.split(/\n/);
                    // console.log(this.detailDatas)
                }
            }).catch(error=>{
                console.log(error)
            })
        },

        // token验证
        isToken(){
            let tokenString = localStorage.getItem("tokenString")
            // let tokenString =  this.$cookies.get("tokenString");
            // console.log("tokenSting：",tokenString);
            if(!tokenString){
                this.$toast({
                    message: '请登录~',
                    forbidClick: true,
                    duration:1000,
                });
                // return this.$router.push({name: "Login"})
                return
            }
        },

        // 获取收藏
        collect(){
            let tokenString = localStorage.getItem("tokenString")
            // console.log("tokenSting：",tokenString);
            
            this.isToken()

            this.axios({
                method: "POST",
                url: this.baseUrl+"like",
                data:{
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.code == 700){
                    this.$toast({
                        message: '请登录~',
                        forbidClick: true,
                        duration:1000,
                    });
                    return
                }
                if(res.data.code == 800){
                    this.iscollect = true
                    // console.log("shoucang")
                }else{
                    this.$toast({
                        message: '请登录~',
                        forbidClick: true,
                        duration:1000,
                    });
                    return
                }
            }).catch(error=>{
                console.log(error)
            })
        },

        // 取消收藏
        cancelCollect(){
            let tokenString = localStorage.getItem("tokenString")

            if(!tokenString){
                this.$toast({
                    message: '请登录~',
                    forbidClick: true,
                    duration:1000,
                });
                // return this.$router.push({name: "Login"})
                return
            }

            this.axios({
                method: "POST",
                url: this.baseUrl+"notlike",
                data:{
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString
                }
            }).then(res=>{
                // console.log(res)
                if(res.data.code == 700){
                    this.$toast({
                        message: '登陆失效 请重新登录',
                        forbidClick: true,
                        duration:1000,
                    });
                    return
                }
                if(res.data.code == 900){
                    if(res.data.result===1){
                        // 取消收藏
                        this.iscollect = false
                        // console.log("quxiao")
                    }
                }else{
                    this.$toast({
                        message: '请登录',
                        forbidClick: true,
                        duration:1000,
                    });
                    return;
                }
            }).catch(error=>{
                console.log(error)
            })
        },

        // 查询收藏
        queryCollect(){
            let tokenString = localStorage.getItem("tokenString")

            if(!tokenString){
                // this.$toast({
                //     message: '请登录~',
                //     forbidClick: true,
                //     duration:1000,
                // });
                // return this.$router.push({name: "Login"})
                return
            }

            this.axios({
                method: "GET",
                url: this.baseUrl+"findlike",
                params:{
                    appkey: this.appkey,
                    pid: this.pid,
                    tokenString
                }
            }).then(res=>{
                // console.log(res.data)
                 if (res.data.code == 700) {
                    return;
                }
                if (res.data.code === 1000) {
                    //已收藏
                    if (res.data.result.length > 0) {
                        this.iscollect = true;
                    }
                }
                
            }).catch(error=>{
                console.log(error)
            })
        },

        // 收藏或取消收藏
        isCollect(){
            if(this.iscollect){
                // 取消收藏
                this.cancelCollect();
            }else{
                this.collect()
            }
        },

        // 添加到购物车
        addshopCar(){
            let tokenString = localStorage.getItem("tokenString")

            // token验证
            if(!tokenString){
                this.$toast({
                    message: "请登录",
                    forbidClick: true,
                    duration:1000,
                });
                return;
            }

            // 处理数据
            let choicelist=[]
            this.detailDatas.userHobby.forEach(v=>{
                choicelist.push(v.rule[v.index].title)
            })
            // 发起请求
            this.axios({
                method: "POST",
                url: this.baseUrl + "addShopcart",
                data:{
                    pid: this.pid,
                    count:this.count,
                    appkey: this.appkey,
                    tokenString: tokenString,
                    rule: choicelist.join("/")
                }
            }).then(res=>{
                if(res.data.code == 3000){
                    this.sids = res.data.sid
                    console.log(this.sids)
                    if(res.data.status == 1){
                        ++this.shopcarCount;
                    }
                }
            }).catch(error=>{
                console.log(error);
            })
        },

        // 处理 badge显示数量，获取购物车商品条目（不是商品总数量）
        getShopcarCount(){
            let tokenString = localStorage.getItem("tokenString")
            if(!tokenString){
                return;
            }
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
        },

        //立即购买
        buy(){ 
            let tokenString = localStorage.getItem("tokenString")
            if(!tokenString){
                this.$toast({
                    message: "请登录",
                    forbidClick: true,
                    duration:1000,
                });
                return;
            }
            // 处理数据
            let choicelist=[]
            this.detailDatas.userHobby.forEach(v=>{
                choicelist.push(v.rule[v.index].title)
            })
            this.axios({
                method: "POST",
                url: this.baseUrl + "addShopcart",
                data:{
                    pid: this.pid,
                    count:this.count,
                    appkey: this.appkey,
                    tokenString: tokenString,
                    rule: choicelist.join("/")
                }
            }).then(res=>{
                if(res.data.code == 3000){
                    if(res.data.status == 1){
                        ++this.shopcarCount;
                    }
                    this.sids = [res.data.sid]
                    this.$router.push( {name: "SubmitOrder", query:{ sid:this.sids.join("-") } })
                }
            }).catch(error=>{
                console.log(error);
            })
            
        }
    }
}
</script>
