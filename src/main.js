import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入 css格式化 样式表
import "./assets/css/minireset.min.css"

// 导入 awesome字体图标
import 'font-awesome/css/font-awesome.min.css';
// 导入阿里图标库
import "@/assets/fonts/aliicon/iconfont.css";

// 导入animate动画插件
import animated from "animate.css"

// 导入 px 转 rem 文件
import 'lib-flexible/flexible'

// 导入axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// 导入 vue-cookie
import VueCookies from "vue-cookies"


// 导入 vant
import {
  NavBar,
  Field,
  Button,
  Popup,
  Toast,
  Search,
  Tabbar, 
  TabbarItem,
  Swipe,
  SwipeItem,
  Loading,
  Icon,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  SubmitBar,
  Badge,
  Checkbox,
  CheckboxGroup,
  SwipeCell,
  List,
  Empty,
  AddressList,
  AddressEdit,
  Sidebar,
  SidebarItem,
  ImagePreview,
  Image as VanImage,
  Uploader,
  Tab,
  Tabs,
  Dialog,
  NoticeBar,

  
} from "vant";

// 注册 vant
Vue.use(NavBar)
   .use(Field)
   .use(Button)
   .use(Popup)
   .use(Toast)
   .use(Search)
   .use(Tabbar)
   .use(TabbarItem)
   .use(Swipe)
   .use(SwipeItem)
   .use(Loading)
   .use(Icon)
   .use(Stepper)
   .use(GoodsAction)
   .use(GoodsActionIcon)
   .use(GoodsActionButton)
   .use(SubmitBar)
   .use(Badge)
   .use(Checkbox)
   .use(CheckboxGroup)
   .use(SwipeCell)
   .use(List)
   .use(Empty)
   .use(AddressList)
   .use(AddressEdit)
   .use(Sidebar)
   .use(SidebarItem)
   .use(ImagePreview)
   .use(VanImage)
   .use(Uploader)
   .use(Tab)
   .use(Tabs)
   .use(Dialog)
   .use(NoticeBar)


// 注册动画插件
Vue.use(animated)
// 注册 vue-cookies
Vue.use(VueCookies)

// 请求之前执行，请求拦截器
axios.interceptors.request.use(config=>{
  // console.log(config);
  if(config.method=="post"){
    let dataValue = "";
    for(let key in config.data){
      // console.log(key)
      dataValue += `${key}=${config.data[key]}&`
    }
    // 切割掉最后一个 &号
    config.data = dataValue.slice(0,-1);
  }

  // 返回数据
  return config
})

// 注册axios
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

// 抽离请求路径 将请求路径存放在 原型属性中
Vue.prototype.baseUrl="http://www.kangliuyong.com:10002/"
Vue.prototype.appkey="U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA="


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// 格式画日期
Vue.filter("formatDate",(data,format)=>{
  // data: 需要格式 化 的数据
  // format： 格式
  let date = new Date(data);
  let year = date.getFullYear().toString();
  if(/(y+)/.test(format)){
    let yearContent = RegExp.$1;
    format = format.replace(yearContent,year.slice(year.length - yearContent.length));
  }

  // 替换时分秒
  let dateObject={
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  }
  for(let key in dateObject){
    // console.log(key)
    // 生成 动态 正则表达式
    let reg = new RegExp(`(${key}+)`);
    if(reg.test(format)){
  
      // 获取匹配的内容
      let content = RegExp.$1;
      format = format.replace(content, dateObject[key] >=10 ? dateObject[key] : content.length == 2 ? "0" + dateObject[key] : dateObject[key] )

    }
  }

  return format
})