import {request,request2} from './request';  //因为request不是export default  reques这样的导出方式，所以需要加大括号

//轮播图即推荐图片的数据资源
export function getHomeMultidata() {
    return request2({
        url: '/home/multidata'
    })
}

//获取tabcontrol下面的商品列表数据
export function getHomeGoods(type,page) {
    return request2({
        url: '/home/data',
        params: {
            type,
            page
        }
    })
}
