import axios from 'axios'

export function request(config) {
    //1.创建实例
    const instance = axios.create({
        baseURL: 'http://123.207.32.32:8000/api/wh',
        // baseURL: 'http://106.54.54.237:8000/api/wh',
        timeout: 5000
    })

    //2.请求拦截器
    instance.interceptors.request.use(config => {
        return config  //此处一定要返回config,否则相当于拦截了config，接收方就收不到了，
                       //如果有需要此处可以进一步处理再返回：
                       //1.比如在网络请求时出现圆圈的效果就可以在这里添加
                       //2.config中有一些信息不符合服务器的要求
                       //3.某些网络请需求（比如登录（token))需要携带一些特殊信息可在此处理，如果有token就继续请求，没有就跳转到登录界面
    })

    //3.响应拦截器 
    instance.interceptors.response.use(res =>{
        return res.data   //我们要使用的其实就是data里的东西，所以返回res.data就好，原理和请求拦截器类似，一定要返回
    })

    //4.发送请求
    return instance(config)
}


export function request2(config) {
    //1.创建实例
    const instance = axios.create({
        baseURL: 'http://152.136.185.210:8000/api/h8',
        // baseURL: 'http://123.207.32.32:8000/api/h8',
        // baseURL: 'http://106.54.54.237:8000/api/h8',
        timeout: 5000
    })

    //2.请求拦截器
    instance.interceptors.request.use(config => {
        return config  //此处一定要返回config,否则相当于拦截了config，接收方就收不到了，
                       //如果有需要此处可以进一步处理再返回：
                       //1.比如在网络请求时出现圆圈的效果就可以在这里添加
                       //2.config中有一些信息不符合服务器的要求
                       //3.某些网络请需求（比如登录（token))需要携带一些特殊信息可在此处理，如果有token就继续请求，没有就跳转到登录界面
    })

    //3.响应拦截器 
    instance.interceptors.response.use(res =>{
        return res.data   //我们要使用的其实就是data里的东西，所以返回res.data就好，原理和请求拦截器类似，一定要返回
    })

    //4.发送请求
    return instance(config)
}