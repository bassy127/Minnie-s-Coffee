<template>
    <div class="detail">
        <van-nav-bar left-arrow fiexd>
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
                <div class="choose"  v-for="(val,i1) in detailDatas.userHobby" :key="i1">
                    <i class="iconfont icon-plus-minus">
                        &nbsp;&nbsp;{{val.hobTag}}：
                    </i>
                    <span v-for="(v,i2) in detailDatas.userHobby[i1].hobChoise.choise" :key="i2" @click="changIndex(val,i2)" :class="{active: val.index == i2}">
                        {{v}}
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
            <van-goods-action-icon icon="chat-o" text="购物车" />
            <van-goods-action-icon icon="like-o" text="收藏" />
            <van-goods-action-button color="#be99ff" type="warning" text="加入购物车" />
            <van-goods-action-button color="#7232dd" type="danger" text="立即购买" />
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
            pid:"",
            detailDatas:[],
            desc:[],
        }
    },
    created(){
        // 获取路由路径的pid
        this.pid = this.$route.params.pid
        this.getDetail();
    },
    methods:{
        changIndex(item,index){
            // 当点击相同的时候
            if(item.index == index){
                return
            }
            item.index = index
        },
        getDetail(){
            this.axios({
                method: "GET",
                url: this.baseUrl + "productDetail",
                params:{
                    appkey: this.appkey,
                    pid: this.pid
                }
            }).then(res=>{
                // console.log(res);
                if(res.data.code == 600){
                    let result = res.data.result[0]
                    // 对数据进行处理
                    let hobbylist = [ "sugar","tem","milk","cream" ];
                    
                    // 给后台 数据添加一个空数组，用于存放最后处理完的 数据
                    result.userHobby=[];

                    hobbylist.forEach(function(val,i){
                        // 判断数据里面的 标签是否为 空
                        if(result[val] == ""){
                            return
                        }
                        // 整合 hobTag信息
                        let hobDatas = {
                            hobTag: result[val+"_desc"],
                            index: i
                        };

                        // 真核 选择信息
                        let hobChoise = {
                            choise: result[val].split("/"),
                        }

                        hobDatas.hobChoise = hobChoise

                        result.userHobby.push(hobDatas)

                    })
                
                    // 将处理完成的 结果 赋值给 detailDatas
                    this.detailDatas= result;
                    console.log(result)
                    this.desc = result.desc.split(/\n/)
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    }
}
</script>
