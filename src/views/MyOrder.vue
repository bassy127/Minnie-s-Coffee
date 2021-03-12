<template>
  <div class="myOrder">
    <van-nav-bar left-arrow fixed @click-left="goback">
      <template #title> 我的订单 </template>
    </van-nav-bar>

    <div>
      <van-tabs
        v-model="active"
        swipeable
        :line-height="2"
        color="#000"
        title-active-color="#999"
        title-inactive-color="#000"
        sticky
        @change="changeStatus"
      >
        <van-tab v-for="(v, i) in tab" :key="i" :title="v.title" >
          <div v-if="allOrder.length > 0">
            <div class="tab-box" v-for="(v1,i1) in allOrder" :key="i1">
              <div class="number">
                <span>{{v1.oid}}</span>
                <span class="finish" v-if="v1.status == 2" @click="removeOrder(v1.oid, i1)">
                  已完成<van-icon name="delete-o" />
                </span>
                <span class="doing" v-if="v1.status == 1" @click="confirmOrder(v1, i1)">确认收货</span>
              </div>
              <OrderItem :order-list="v1.data"></OrderItem>
              
              
              <div class="order">
                  <p class="time">{{v1.date | formatDate("yyyy-MM-dd hh:mm:ss")}}</p>
                  <div class="pay">
                      <span>共计 {{v1.count}} 件</span>
                      <span>合计 ￥{{v1.total}}</span>
                  </div>
              </div>

            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/myOrder.less";
import OrderItem from "../components/OrderItem.vue";

export default {
  name: "MyOrder",
  components: {
    OrderItem,
  },
  data() {
    return {
      active: 0,

      tab: [
        {
          title: "全部",
          status: 0,
        },
        {
          title: "进行中",
          status: 1,
        },
        {
          title: "已完成",
          status: 2,
        },
      ],
      
      allOrder:[],
      orderList:[],
      
    };
  },
  created() {
    this.findOrder(0);
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },

    // 查询订单
    findOrder(status) {
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
        url: this.baseUrl + "findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 70000) {
            this.allOrder=[];

            let idList = []
            // this.allOrder = res.data.result
            
            // 去除相同的  订单号id
            res.data.result.forEach(v=>{
              v.small_img = v.smallImg;
              // console.log(v)
              if(idList.indexOf(v.oid) == -1){
                let o = {
                  oid: v.oid,
                  status: v.status,
                  date: v.updatedAt,
                  count : 0,
                  total: 0,
                  data: [],
                }
                idList.push(v.oid)
                this.allOrder.push(o)
              }
            })
            // console.log(this.allOrder)

            // 根据 id 筛选出 相同 订单号的 商品
            this.allOrder.forEach(value=>{
              res.data.result.forEach((item) => {
                if (value.oid == item.oid) {
                  value.data.push(item);
                  value.count += item.count;
                  value.total += item.count * item.price;
                }
              });
            })
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    // 切换订单状态
    changeStatus(name,title){
      this.findOrder(name)
    },

    //确认订单
    confirmOrder(item, index) {
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
        method: "POST",
        url: this.baseUrl + "receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid
        },
      })
        .then((res) => {
          console.log("res confirmOrder ==> ", res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 80000) {
            item.status = 2;



            if (this.active === 1) {
              //移除当前tab的订单数据
              this.allOrder.splice(index, 1);
            }
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },


    //删除订单
    removeOrder(oid, index) {
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
        method: "POST",
        url: this.baseUrl + "removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        },
      })
        .then((res) => {
          // console.log("res removeOrder ==> ", res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 90000) {
            this.allOrder.splice(index, 1);
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    }
  },
};
</script>
