// axios-1.0.js
import axios from 'axios';
// import Qs from 'qs';

// 创建新实例
let csrftoken = ''
try {
    csrftoken = document.cookie.match(/csrftoken=\w+/g)[0].replace(/csrftoken=/, '')
}catch(err) {
	console.log('csrftoken_err', 'err')
}

var instance = axios.create({
	method:'get', //default
	baseURL:'',   // base url
	headers:{
		'Content-Type': 'application/json',
		'X-CSRFTOKEN' : csrftoken
	},
	timeout: 5000,
	data:{},  // request body
	params:{}, //  url 查询对象
	transformRequest: [function (data, headers) {
       // Do whatever you want to transform the data
       return JSON.stringify(data);
  }],
  transformResponse: [function (data) {
       // Do whatever you want to transform the data
       return data
  }],
  withCredentials:true, // cross-site Access-Control requests
  // responseType: 'json', // default
})


// Add a request interceptor
instance.interceptors.request.use(function (config) {
	// Do something before request is sent
    return config;
  }, function (error) {
  	// Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
     if(error && error.response){
   		switch (error.response.status) {
   			case 404 :
   			  layer.msg('请求地址:' + error.config.url + '出错！')
                break
   			case 408 :
   			  layer.msg('请求超时！')
                break
   			case 500 :
   			  layer.msg('服务器出错！')
                break

        default  :
          let data = error.response.data
          if(typeof data === 'string') {
             // 兼容ie
             data = JSON.parse(data)
          }
          layer.msg(data.detail)
   		}
 	   }

 	   return Promise.reject(error);
  });

// 通用 ajax
export function axiosRequest(params) {
   if(typeof params.url == undefined) {
   	 throw 'url should de must'
   }
   return new Promise((resolve, reject) => {
   	 instance(params).then((resp) => {
       let data = resp.data
       if(typeof data === 'string') {
        // 兼容ie
          data = JSON.parse(resp.data)
       }
       resolve(data)
   	 }).catch((error) => {
       if(typeof error.response.data === 'string') {
         // 兼容ie
         error.response.data = JSON.parse(error.response.data)
       }
       console.log('error-----', error)
   	 	 reject(error)
   	 })
   })
}