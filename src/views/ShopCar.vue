<template>
    <div class="shopcar-box">
        <van-nav-bar 
            left-arrow 
            fixed
            @click-left="goback" 
        >
            <template #right>
                <div @click="edit" v-show="sliceShopcar.length > 0">
                    {{ !isEdit? '编辑': '完成'}}
                </div>
            </template>
            <template #title>
                <van-icon class="fa fa-shopping-cart"/>
                购物车
            </template>
        </van-nav-bar>
        
        <!-- 广告区域 -->
        <!-- <div class="ad"></div> -->
        <div v-if="sliceShopcar.length > 0">
            <div class="carItem">
                <!-- 懒加载 -->
                <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text=" 已经到底啦 "
                    @load="loadShopCar"
                >
                    <!-- 购物车列表 -->
                    <div class="itembox" v-for="(v,index) in sliceShopcar" :key="v.sid">
                        <!-- 滑动单元格 -->
                        <van-swipe-cell stop-propagation 
                            :disabled="isEdit"
                            open="open"
                        >           
                            <div class="card">
                                <!-- 单选框 -->
                                <van-checkbox 
                                    v-model="v.isChecked"
                                    checked-color="#999"
                                    @click="checkSingle"
                                />
                                <div class="fr">
                                    <img :src="v.small_img">
                                    <div class="desc">
                                        <div @click.stop.prevent="toTargetUrl(v.pid)">
                                            <p class="cName">
                                            {{v.name}}
                                            <span>{{v.rule}}</span>
                                            </p>
                                            <p class="eName">{{v.enname}}</p>
                                        </div>
                                        <div class="price-box">
                                            <span class="price fa fa-jpy">{{v.price}}</span>
                                            <div class="countBtn">
                                                <van-stepper
                                                    theme="round" 
                                                    button-size="22" 
                                                    disable-input
                                                    v-model="v.count"
                                                    @change="updateShopCar(v.count,v.sid)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <template #right>
                                <van-button square type="danger" text="删除"  @click="delProduct([v.sid],index)" />
                            </template>

                        </van-swipe-cell>

                    </div>
                </van-list>
            </div>


            <!-- 提交订单 -->
            <van-submit-bar 
                :price="money" 
                button-text="提交订单"
                v-show="!isEdit"
                @submit="submit"
            >
                <!-- <template #button>
                    <div class="fl"></div>
                </template> -->
                <van-checkbox 
                    checked-color="#ee0a24"
                    v-model="selectAll"
                    @click="checkAll"
                >
                    全选
                </van-checkbox>
            </van-submit-bar>

            <van-submit-bar 
                button-text="删除" 
                v-show="isEdit"
                button-color="red"
                @submit="delSelect"
            >
                <van-checkbox 
                    checked-color="#ee0a24"
                    @click="checkAll"
                    v-model="selectAll"
                >
                    全选
                </van-checkbox>
            </van-submit-bar>
        </div>

        <div v-else>
            <van-empty
                class="custom-image"
                image="https://img.yzcdn.cn/vant/custom-empty-image.png"
                description="暂无添加任何商品~~~"
            />
        </div>
    </div>

</template>

<script>
import "../assets/less/shopcar.less"

    export default {
        name:"ShopCar",
        components:{},
        data(){
            return{
                // 编辑
                isEdit: false,
                
                allShopcarProduct:[], // 购物车商品列表总数
                sliceShopcar:[],  // 截取出来的 购物车商品

                // 全选
                selectAll: false,
                total:0, // 购物车总数量

                money:0,

                // 懒加载
                loading: true, //是否正在加载中，防止多次触发，首次不触发
                finished: false, // 数据加载完成，改为true即可
                star:0,    // 开始截取的下标
                end:10,    // 结束截取的小标
            }
        },
        mounted(){
            this.queryShopcartCount();
        },
        methods:{
            goback(){
                this.$router.go(-1);
            },
            edit(){
                this.isEdit=!this.isEdit
                console.log("000")
            },
            
            // 跳转到商品详情
            toTargetUrl(pid){
                this.$router.push({name: "Detail",params:{pid}});
            },

            // 获取购物车商品
            queryShopcartCount(){
                let tokenString = localStorage.getItem("tokenString")
                // console.log(tokenString)
                if(!tokenString){
                    this.$toast({
                        message: "登录了才可以查看~~",
                        forbidClick: true,
                        duration: 1000
                    })
                    return
                }
                this.axios({
                    method: "GET",
                    url: this.baseUrl + "findAllShopcart",
                    params:{
                        appkey: this.appkey,
                        tokenString: tokenString
                    }
                }).then(res=>{
                    // console.log(res)
                    if(res.data.code == 5000){
                        // 循环遍历 给每条数据 添加一个 isCheck属性
                        res.data.result.forEach(v=>{
                            v.isChecked = false
                        })

                        this.allShopcarProduct = res.data.result

                        // 截取商品条数
                        this.sliceShopcar = this.allShopcarProduct.slice(this.star, this.star+this.end)
                        // 重置 开始的下标
                        this.star+=this.end
                        

                        // 判断，当购物车 总商品数量 小于 this.end 时 ，不要再继续加载
                        if(this.allShopcarProduct.length < this.end ){
                            this.finished = true;
                            return;
                        }
                        // 加载状态
                        this.loading = false;
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        })
                        return this.$router.push({name: "Login"})
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            // 商品懒加载，加载数据
            loadShopCar(){
                setTimeout(()=>{

                    let data = this.allShopcarProduct.slice(this.star, this.star+this.end)
                    // 重置开始截取 的下标
                    this.star+=this.end

                    if(data.length < this.end){
                        // 加载完成，不再触发load事件
                        this.finished = true
                    }

                    // 将懒加载的数据添加 到 allShopcarProduct数组中
                    this.sliceShopcar.push(...data);

                    // 加载状态结束
                    this.loading = false;

                },1500)
            },

            // 修改购物车数量
            updateShopCar(count,sid){
                let tokenString = localStorage.getItem("tokenString")
                // 验证token值
                if(!tokenString){
                    this.$toast({
                        message: "登录了才能操作哦~ 购物车-加减按钮",
                        forbidClick: true,
                        duration: 1000
                    })
                    return
                };

                // 发起请求 
                this.axios({
                    method: "POST",
                    url: this.baseUrl + "modifyShopcartCount",
                    data:{
                        appkey: this.appkey,
                        tokenString: tokenString,
                        sid: sid,
                        count: count,
                    }
                }).then(res=>{
                    if(res.data.code =6000){
                        this.sumMoney()
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 800
                        })
                    }
                }).catch(error=>{
                    console.log(error);
                })
            },

            // 全选
            checkAll(){
                this.allShopcarProduct.forEach(v=>{
                    v.isChecked = this.selectAll  
                });
                this.sumMoney()
            },
            // 单选 - 给单选框绑定
            checkSingle(){
                this.sumMoney();

                for(let i=0; i< this.sliceShopcar.length; i++){
                    if(!this.sliceShopcar[i].isChecked){
                        this.selectAll = false;
                        return
                    }
                };
                this.selectAll  = true;
            },

            // 删除单个商品
            delProduct(sid,index){
                let tokenString = localStorage.getItem("tokenString")
                // 验证token值
                if(!tokenString){
                    this.$toast({
                        message: "登录了才能操作哦~ 购物车-加减按钮",
                        forbidClick: true,
                        duration: 1000
                    })
                    return
                };
                // 发起 请求
                this.axios({
                    method: "POST",
                    url: this.baseUrl + "deleteShopcart",
                    data:{
                        appkey : this.appkey,
                        tokenString: tokenString,
                        sids: JSON.stringify(sid)
                    }
                }).then(res=>{
                    if(res.data.code == 7000){
                        this.sliceShopcar.splice(index,1);
                        this.checkSingle();
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    })
                }).catch(error=>{
                    console.log(error);
                })
            },

            // 删除选择的商品
            delSelect(){
                // 获取 勾选 商品的id
                let sid = [];
                this.allShopcarProduct.forEach(v=>{
                    if(v.isChecked){
                        sid.push(v.sid)
                    }
                });

                if(sid.length ==0 ){
                    this.$toast({
                        message: "未选择任何商品",
                        forbidClick: true,
                        duration: 1000
                    })
                    return
                }
                
                let tokenString = localStorage.getItem("tokenString")
                // 验证token值
                if(!tokenString){
                    this.$toast({
                        message: "登录了才能操作~~",
                        forbidClick: true,
                        duration: 1000
                    })
                    return
                };

                // 发起 请求
                this.axios({
                    method: "POST",
                    url: this.baseUrl + "deleteShopcart",
                    data:{
                        appkey : this.appkey,
                        tokenString: tokenString,
                        sids: JSON.stringify(sid)
                    }
                }).then(res=>{
                    if(res.data.code == 7000){
                        for(let i=0; i<this.sliceShopcar.length; i++){
                            if(this.sliceShopcar[i].isChecked){
                                this.sliceShopcar.splice(i,1);
                                i--;
                            }
                        }
                        this.sliceShopcar.length - sid.length
                        this.sumMoney();
                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 800
                    })
                }).catch(error=>{
                    console.log(error);
                })
                
            },

            // 计算 金额
            sumMoney(){
                let money = 0;
                this.sliceShopcar.forEach(v=>{
                    if(v.isChecked){
                        money += v.price * v.count
                    }
                })
                this.money = money * 100
            },


            // 提交订单
            submit(){
                let sid = [];
                this.allShopcarProduct.forEach(v=>{
                    if(v.isChecked){
                        sid.push(v.sid)
                    }
                });

                if(sid.length ==0 ){
                    this.$toast({
                        message: "未选择任何商品",
                        forbidClick: true,
                        duration: 1000
                    })
                    return
                }

                this.$router.push( {name: "SubmitOrder", query:{ sid:sid.join("-") } })
            }
        }
    }
</script>