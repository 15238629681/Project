
/**
 *  插件采用函数闭包形式
 *  在jquery 原型链上增加了一些属性和方法
 *  调用形式 就是普通的$(dom).functionName()
 */
import jQuery from 'jquery'
(function($){
	// 全局变量
  var ajaxThrottle = null
  var promiseThrottle = null
    
	/**
	  *判断字符串 len
	*/
	$.fn.StringLen = function() {
		// todo
		return $(this).replaceWith(/[^\x00-\xff]/g, "xx").length   
	}
	/**
	 *  前端校核
	*/
	$.fn.checkIsTrue = function() {
	  /**
	  * 判断 <input> 或 <select> 是否有 data-check-flag 属性， 有则是必填
	  */

      function judgeIsTrue (_that) {
	  	 if(!_that.val().trim()) {
	  	 	_that.css('border', '1px solid red')
	  	 	flag = false
	  	 }
	  	 if(_that.val().trim()) {
	  	 	_that.css('border', '1px solid #dedede')
	  	 }
	  }

	  var _this = $(this)
      var flag = true

      _this.find('input[data-check-flag="true"], select[data-check-flag="true"]').each(function(i, item) {
         judgeIsTrue($(this))
      })

      _this.find('input[data-check-flag="true"], select[data-check-flag="true"]').on('change', function() {
      	 judgeIsTrue($(this))
      })

      if(!flag) {
      	layer.msg('请填写必填项！')
      	return false
      }
      return flag
	}
	/**
	 *  全选
	*/
	$.fn.checkboxAll = function(cb) {
	  var _this = $(this)
      $(document).on('click', 'input[name="all-checkbox"]', function() {
      	 if(this.checked) {
            _this.find('input[name="sub-checkbox"]').prop('checked', true)
      	 }else {
      	 	_this.find('input[name="sub-checkbox"]').prop('checked', false)
      	 }
      	 cb && cb()
      })

      var count = 0
      $(document).on('click', 'input[name="sub-checkbox"]', function() {
      	 var subCheckbox = _this.find('input[name="sub-checkbox"]')
         $.each(subCheckbox, function(i, item) {
         	if(item.checked) {
         		count ++
         	}
         	if(count === subCheckbox.length) {
         		$('input[name="all-checkbox"]').prop('checked', true)
         	}else {
         		$('input[name="all-checkbox"]').prop('checked', false)
         	}
         })
         count = 0
      })
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
      		layer.msg(msg)
      		throw msg
      	}else {
      		previous = current
      	}
      }
	}
	 /**
	 * ajax request
	 * ajax must request layer component before
	 * @param url // required
	 * @param csrftoken  // csrftoken for Request 
	 * @param type // default get
	 * @param data // default {}
	 * @param cb //   callback 
	 */

	 ajaxThrottle = $(document).throttle(300, '请求太频繁了！')
	 $.fn.ajax = function(opt, cb) {
	 	if(typeof opt.type != 'undefined') {
	 		ajaxThrottle()
	 	}
	 	let csrftoken
	 	try {
       	   csrftoken = document.cookie.match(/csrftoken=\w+/g)[0].replace(/csrftoken=/, '')
       	}catch(err) {
           csrftoken = ''
       	}
        // loading
        var index = layer.load(0, {shade: false})
        if(opt.url === undefined) {
        	throw 'ajax url can not be null'
        }
        var data = opt.data ? JSON.stringify(opt.data) : ''
        var result = null
	    result = $.ajax({
	        url: opt.url,
	        type: opt.type || 'GET',
	        beforeSend: function(xhr) {
	            xhr.setRequestHeader("X-CSRFTOKEN", csrftoken)
	        },
	        contentType: 'application/json',
	        timeout : 5000,   // timeout 设置5s
	        data: data
	    }).done(resp => {
	        layer.close(index)
	        cb && cb(null, resp)
	    }).fail(err => {
	        layer.close(index)
	        if(err.status == 403) {
	        	layer.msg('请求权限受限！')
	        	return false
	        }
            if(err.status == 408) {
            	layer.msg('请求超时！')
            	return false
            }
	        if(err.status == 500) {
	           layer.msg('服务器出错！')
	           return 
	        }
          if(cb) {
             cb(err, null)
          }else {
             try {
               layer.msg(err.responseJSON.detail)
            }catch(err){
                 console.log('err', err)
            }
          }
	    })
	 }
     promiseThrottle = $(document).throttle(300, '请求太频繁了！')
	 $.fn.promiseAjax = (opt) => {
	   if(typeof opt.type != 'undefined') {
		  promiseThrottle()
	   }
	   let Promise = require("bluebird") // 兼容ie promise
       return new Promise((resolve, reject) => {
       	  let csrftoken
       	  try {
       	     csrftoken = document.cookie.match(/csrftoken=\w+/g)[0].replace(/csrftoken=/, '')
       	  }catch(err) {
             csrftoken = ''
       	  }
	      // loading
	      let index = layer.load(0, {shade: false})
	      if(opt.url === undefined) {
	        throw 'ajax url can not be null'
	      }
        if(opt.type != 'GET' && opt._this) {
          opt._this.css('backgroundColor', 'gray')
          opt._this.attr('disabled', 'disabled')
        }
	      $.ajax({
	      	type: opt.type || 'GET',
	      	url : opt.url,
	      	beforeSend: function(xhr) {
	            xhr.setRequestHeader("X-CSRFTOKEN", csrftoken)
	        },
	        contentType: opt.contentType || 'application/json',
	        timeout: opt.timeout || 5000,
	        data: opt.data ? JSON.stringify(opt.data) : ''
	      })
	      .done((resp) => {
			  if(opt._this){
				  opt._this.removeAttr('style')
             	  opt._this.removeAttr('disabled')
			  }
             
             layer.close(index)
             resolve(resp)
	      })
	      .fail((err) => {
			if(opt._this){
               opt._this.removeAttr('style')
			   opt._this.removeAttr('disabled')
			}
             layer.close(index)
             if(err.status == 403) {
	        	layer.msg('请求权限受限！')
	        	return
	        }
            if(err.statusText == 'timeout') {
            	layer.msg('请求超时！')
            	return
            }
	        if(err.status == 500) {
	           layer.msg('服务器出错！')
	           return 
	        }
	        try {
               layer.msg(err.responseJSON.detail)
	        }catch(err){
	           // layer.msg('无法捕捉的错误信息')
               console.log('err', err)
	        }
	        reject(err)
	      })
       })
	 }

	 // 时间处理函数
  Date.prototype.Format = function (fmt) { //author: meizz
      this.setTime(this.getTime() + (this.getTimezoneOffset()*60000));
      var o = {
          "Y": this.getFullYear(),
          "M": this.getMonth()+1, //月份
          "d": this.getDate(), //日
          "h": this.getHours(), //小时
          "m": this.getMinutes(), //分
          "s": this.getSeconds(), //秒
          "q": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
      }
      if(o.M<10){
        o.M = '0' + o.M
      }
      if(o.d<10){
        o.d = '0' + this.getDate()
      }
      if(o.h<10){
        o.h = '0' + this.getHours()
      }
      if(o.m<10){
        o.m = '0' + this.getMinutes()
      }
      if(o.s<10){
        o.s = '0' + this.getSeconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
  }

     // url取值
     $.fn.urlParam = function(name) {
				// if (!window.location.search.includes(name)) return ''
        if (window.location.search.indexOf(name) == -1) return ''

        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }
    // localStorage 设置过期问题
    $.fn.localStorage = function(opt) {
      if(typeof opt.exp == 'undefined') {
        opt.exp = 24 * 60 * 60  // 默认过期时间 24小时
      }
      var key = opt.key,
          val = opt.val
          exp = opt.exp
          localStorage = window.localStorage
      // param
      // key 储存键 val 储存值 
      // exp 过期时间
      return {
         set: function () {
            var currentTime = new Date().getTime()
            localStorage.setItem(key, JSON.stringify({data: val, time: currentTime}))
         },
         get: function() {
            var data = localStorage.getItem(key)
            var dataObj = JSON.parse(data)
            if(new Date().getTime() - dataObj.time > exp) {
               console.log('信息已过期')
               localStorage.removeItem(key)
            }else {
               var dataObjDatatoJson = JSON.parse(dataObj.data)
               return dataObjDatatoJson;
            }
         }
      }
    }
 })(jQuery)

