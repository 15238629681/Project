/*
ukey 通用方法
***
**
*
*/
  var uKey = function () {

  }
  uKey.prototype.getRsa = function(ukeyUser) {
    var self = this
    var rsa
    if(typeof ukeyUser == 'undefined') {
      layer.alert('缺少ukey参数')
      throw '缺少ukey参数'
    }
    if(ukeyUser == 'True') {
      if(!self.checkIsIe()) {
        throw '您是ukey用户,请在ie浏览器使用此功能！'
      }
      if(!self.checkIsInstallUkey()) {
        throw '未检测到ukey设备或ukey设备未插好,或未导入正确的证书！'
      }

      // 是ukey 用户
      // rsa 硬件签名
      // 签名密钥  KeySpec = 2
      var index = 0
      var KeySpec = 2
      var ContainList = HTCOM.HCOMListContainers(index)
      var ContainName = ContainList.split("|")[0]
      var OrigData = HTCOM.HCOMGetKeySerial(index)
          rsa = HTCOM.HCOMRSASign(index, ContainName, KeySpec, OrigData)

      if(rsa == '3758227465') {
        layer.alert('请插入ukey设备!', function(index) {
           layer.close(index)
           throw '请插入ukey设备!'
        })
        throw '请插入ukey设备!'
      }
      
      if(rsa == '87') {
        layer.alert('请输入pin码!', function(index) {
          layer.close(index)
          throw '请输入pin码!'
        })
        throw '请输入pin码!'
      }
      
      if(rsa == '2281701437') {
        layer.alert("pin码错误！", function(index) {
          layer.close(index)
          throw 'pin码错误！'
        })
        throw 'pin码错误！'
      }
      
      if(rsa == '2281701384' || rsa == '2281701479') {
         layer.alert('您取消或关闭了pin码操作！', function(index) {
          layer.close(index)
          throw '您取消或关闭了pin码操作！'
        })
        throw '您取消或关闭了pin码操作！'
      }
      return rsa
    }else {
      // 非 ukey 用户
      return rsa = ''
    }

   //  try {    
   //    var index = 0    
   //    var KeySpec = 2    
   //    var ContainList = HTCOM.HCOMListContainers(index)    
   //    var ContainName = ContainList.split("|")[0]    
   //    var OrigData = HTCOM.HCOMGetKeySerial(index)   
   //    var rsa = HTCOM.HCOMRSASign(index, ContainName, KeySpec, OrigData)   
   
   //   if(rsa == '3758227465') {    
   //      layer.alert('请插入ukey设备!', function(index) {    
   //        layer.close(index)    
   //        throw '1'   
   //     })   
   //     throw '1'    
   //   }    
          
   //   if(rsa == '87') {    
   //      layer.alert('请输入pin码!', function(index) {    
   //        layer.close(index)   
   //       throw '2'    
   //     })   
   //     throw '2'    
   //    }    
         
   //   if(rsa == '2281701437') {    
   //     layer.alert("pin码错误！", function(index) {   
   //       layer.close(index)   
   //       throw '3'    
   //     })   
   //     throw '3'    
   //   }    
         
   //   if(rsa == '2281701384' || rsa == '2281701479') {   
   //      layer.alert('您取消或关闭了pin码操作！', function(index) {   
   //       layer.close(index)   
   //        throw '4'    
   //     })   
   //     throw '4'    
   //   }    
   //   return rsa   
   // }catch (err){    
   //   if(err === '1')    
   //     throw '请插入ukey设备!'   
   
   //   if(err === '2')    
   //     throw '请输入pin码！'   
   
   //   if(err === '3')    
   //     throw 'pin码错误！'    
    
   //   if(err === '4')    
   //      throw '您取消或关闭了pin码操作！'   
   
   //   console.log('err', err)    
   //   var rsa    
   //   return rsa = ''    
   // }
  }
  // 检测是否是ie
  uKey.prototype.checkIsIe = function() {
    var userAgent = navigator.userAgent
    var isIE = userAgent.indexOf('Trident') > -1
    if(!isIE) {
      layer.alert('您是ukey用户,请在ie浏览器使用此功能！')
      return false
      throw ('您是ukey用户,请在ie浏览器使用此功能！')
    }else {
      return true
    }
  }
  // 检测是否安装ukey
  uKey.prototype.checkIsInstallUkey = function() {
      try {
          var KeyNum = HTCOM.GetDeviceCount();
          if(KeyNum == 0) {
              layer.alert('未检测到ukey设备')
              return false;
          }else {
              return true;
          }
      }catch(err) {
          console.log('err', err)
          layer.alert('ukey设备未插好,或未导入正确的证书！')
          return false
      }
  }
module.exports = uKey