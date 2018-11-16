// ajax-1.0.js
$(function() {
	function layerMsg(msg) {
       layer.open({
		  content: msg
		  ,skin: 'msg'
		  ,time: 2 //2秒后自动关闭
	   });
	}
	/**
     * 节流限制函数，用于控制ajax, resize, mouseover等频繁操作
	 * request least 至少大于等于这个数才进行操作
	 * request msg   提示用语
	 */
	$.fn.throttle = function (least, msg) {
      var previous = null
      var current
      return function (){
      	current = + new Date()
      	if(!previous) previous = current // 闭包存储previous
      	if(current - previous < least && current - previous != 0) {
      		layerMsg(msg)
      		throw msg
      	}else {
      		previous = current
      	}
      }
	}
	let ajaxThrottle = $(document).throttle(300, '请求太频繁了！')
	 /**
	 * ajax request
	 * @param url // required
	 * @param csrftoken  // csrftoken for Request 
	 * @param type // default get
	 * @param data // default {}
	 * @param cb //   callback resolve and reject
	 */
	$.fn.promiseAjax = function(options) {
	 	if(typeof options.type != 'undefined') {
	 		ajaxThrottle()
	 	}
		if(typeof options.url == undefined) {
			throw 'ajax url is must'
		}
	    let index = layer.open({type: 2,content: '加载中',shadeClose: false});
		return new Promise((resolve, reject) => {
			$.ajax({
               url: options.url,
               type: options.type || 'GET',
               data: JSON.stringify(options.data) || '',
               contentType: options.contentType || 'application/json',
               beforeSend: function(xhr) {
	              xhr.setRequestHeader("X-CSRFTOKEN", options.csrftoken || '')
	           },
	           timeout : options.timeout || 5000,   // timeout 设置5s
			}).done((resp) => {
				resolve(resp)
				layer.close(index)
			}).fail((err) => {
				layer.close(index)
				if(err.status == 403) {
		        	layerMsg('请求权限受限！')
		        	return false
		        }
	            if(err.status == 408) {
		        	layerMsg('请求超时！')
	            	return false
	            }
		        if(err.status == 500) {
		           layerMsg('服务器出错！')
		           return 
		        }
		        try {
	               layer.msg(err.responseJSON.detail)
		        }catch(err){
		           // layerMsg('无法捕捉的错误信息!')
	               console.log('err', err)
		        }
				reject(err)
			})
		})
	}
})