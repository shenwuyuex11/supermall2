import Vue from 'vue'
import Router from 'vue-router'

// 修复连续点击组件（同一个页面）出现uncaught in promise的问题
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {

    return originalPush.call(this, location).catch(err => err)

}


const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Shopcart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')
const Detial = () => import('../views/detail/Detail')

//GIS用页面
const Test = () => import('../test/test1')
const Test2 = () => import('../test/test2')
const Test3 = () => import('../views/test/Index')
const Test4 = () => import('../views/Gis/test3')

const Gis1 = () => import('../views/Gis/test1')
const Info = () => import('../views/Gis/InfoWin')
const EditByPanel = () => import('../views/Gis/edit/Edit')
const Query = () => import('../views/Gis/Query')
const Query2 = () => import('../views/Gis/Query2')
const Goto = () => import('../views/Gis/goto/GoTo')

const FindTask = () => import('../views/Gis/findTask/FindTask')
const FloatingCar = () => import('../views/Gis/car/Car')
const HotelEdit = () => import('../views/Gis/editHotelFeatures/HotelFeatures')
const Buffer = () => import('../views/Gis/buffer/Buffer')

//echarts
const Home2 = () => import('../page/Home')
const ComEcharts =() => import('../page/dataVisual/ComEcharts')


// 1.安装vue-router插件到vue
Vue.use(Router)

// 2.配置路由
const routes = [{
    path: '',
    redirect: '/home2'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/home2',
    component: Home2
  },
  {
    path: '/shopcart',
    component: Shopcart
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/profile',
    component: Profile
  },
  // 以params和query两种方式传参的配置
  // {
  //     path: '/detail',
  //     name: 'Detail',
  //     component: Detial
  // }
  // 直接$router.push方式传参的配置
  {
    path: '/detail/:iid',
    name: 'Detail',
    component: Detial
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/test2',
    name: 'Test2',
    component: Test2
  },
  {
    path: '/gis1',
    name: 'Gis1',
    component: Gis1
  },
  {
    path: '/info',
    name: 'Info',
    component: Info
  },
  {
    path: '/editByPanel',
    name: 'EditByPanel',
    component: EditByPanel
  },
  {
    path: '/query',
    name: 'Query',
    component: Query
  },
  {
    path: '/query2',
    name: 'Query2',
    component: Query2
  },
  {
    path: '/goto',
    name: 'Goto',
    component: Goto
  },
  {
    path: '/test3',
    name: 'Test3',
    component: Test3
  },
  {
    path: '/test4',
    name: 'Test4',
    component: Test4
  },
  {
    path: '/findTask',
    name: 'FindTask',
    component: FindTask
  },
  {
    path: '/floatingCar',
    name: 'FloatingCar',
    component: FloatingCar
  },
  {
    path:'/comEcharts',
    name:'ComEcharts',
    component: ComEcharts
  },
  {
    path: '/hotelEdit',
    name: 'HotelEdit',
    component: HotelEdit
  },
  {
    path: '/buffer',
    name: 'Buffer',
    component: Buffer
  }
  
  
]

// 3.创建路由对象
const router = new Router({
  mode: 'history',
  routes
})

export default router
