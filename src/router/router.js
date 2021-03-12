// 从index.js抽离出来，并导出

// HomePage组件的二级路由
const HomePageRoutes=[
  {
    path: '/home',
    // alias:"/", // 路由别名
    name: 'Home',
    // 懒加载写法
    component: ()=>import("../views/Home.vue")
  },
  {
    path: '/menu',
    name: 'Menu',
    // 懒加载写法
    component: ()=>import("../views/Menu.vue")
  },
  {
    path: '/shopcar',
    name: 'ShopCar',
    // 懒加载写法
    component: ()=>import("../views/ShopCar.vue")
  },
  {
    path: '/my',
    name: 'My',
    // 懒加载写法
    component: ()=>import("../views/My.vue")
  },
]


// 导出路由
export const routes = [
    {
      path: '/',
      name: 'Cover',
      // alias:"",
      // 懒加载写法
      // component: ()=>import("../views/Cover.vue")
      component: ()=>import("../views/Cover.vue")
    },
    {
      path: '/login',
      name: 'Login',
      // 懒加载写法
      component: ()=>import("../views/Login.vue")
    },
    {
      path: '/homepage',
      name: 'HomePage',
      // 懒加载写法
      component: ()=>import("../views/HomePage.vue"),
      
      // 配置二级路由
      children: HomePageRoutes
    },
    {
      path: '/detail/:pid',
      name: 'Detail',
      // 懒加载写法
      component: ()=>import("../views/Detail.vue")
    },
    {
      path: '/addressList',
      name: 'AddressList',
      // 懒加载写法
      component: ()=>import("../views/AddressList.vue")
    },
    {
      //:aid? 表示 aid参数可传递可不传
      path: '/newAddress:aid?',
      name: 'NewAddress',
      // 懒加载写法
      component: ()=>import("../views/NewAddress.vue")
    },
    {
      path: '/submitOrder',
      name: 'SubmitOrder',
      // 懒加载写法
      component: ()=>import("../views/SubmitOrder.vue")
    },
    {
      path: '/myData',
      name: 'MyData',
      // 懒加载写法
      component: ()=>import("../views/MyData.vue")
    },
    {
      path: '/order',
      name: 'Order',
      // 懒加载写法
      component: ()=>import("../views/Order.vue")
    },
    {
      path: '/myOrder',
      name: 'MyOrder',
      // 懒加载写法
      component: ()=>import("../views/MyOrder.vue")
    },
    {
      path: '/myLike',
      name: 'MyLike',
      // 懒加载写法
      component: ()=>import("../views/MyLike.vue")
    },
    {
      path: '/mySave',
      name: 'MySave',
      // 懒加载写法
      component: ()=>import("../views/MySave.vue")
    },
    {
      path: '/findPassword',
      name: 'FindPassword',
      // 懒加载写法
      component: ()=>import("../views/FindPassword.vue")
    },
    {
      path: '/next',
      name: 'Next',
      // 懒加载写法
      component: ()=>import("../views/Next.vue")
    },
    
  ]
  